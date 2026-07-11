import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderClerkEmail } from "@/lib/clerk-emails";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const TEMPLATE_MAP: Record<string, string> = {
  email_link_sign_in: "email_link_sign_in",
  email_link_sign_up: "email_link_sign_up",
  email_link_verify_email: "email_link_verify_email",
  invitation: "invitation",
  verification_code: "verification_code",
  account_locked: "account_locked",
  password_changed: "password_changed",
  password_removed: "password_removed",
  primary_email_address_changed: "primary_email_address_changed",
  reset_password_code: "reset_password_code",
  sign_in_from_new_device: "sign_in_from_new_device",
};

function extractLink(html: string): string | undefined {
  const match = html.match(/<a[^>]+href="([^"]+)"/i);
  return match?.[1];
}

export async function POST(req: Request) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    const body = await req.text();
    payload = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as Record<string, unknown>;
  } catch {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = payload as {
    type: string;
    data: Record<string, unknown>;
  };

  if (type !== "email.created" || !data) {
    return new NextResponse(null, { status: 200 });
  }

  const templateName = (data.slug as string) ?? (data.template_name as string);
  const templateType = TEMPLATE_MAP[templateName];
  if (!templateType) {
    console.warn(`[clerk-webhook] Unknown template: ${templateName}`);
    return new NextResponse(null, { status: 200 });
  }

  // Extract email address and user ID from Clerk payload
  const emailAddress = (data.to_email_address as string) || "";
  const clerkUserId = (data.user_id as string) || null;
  const clerkBody = (data.body as string) ?? "";

  // Nested data block with template variables
  const nestedData = data.data as Record<string, unknown> | undefined;
  const clerkUser = nestedData?.user as Record<string, unknown> | undefined;
  const effectiveUserId = clerkUserId || (clerkUser?.email_address as string) || null;

  // Determine user's language preference from DB
  let locale = "pt";
  if (clerkUserId) {
    try {
      const user = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, clerkUserId),
        columns: { nativeLanguage: true },
      });
      if (user?.nativeLanguage) {
        locale = user.nativeLanguage;
      }
    } catch (e) {
      console.error("[clerk-webhook] DB lookup failed", e);
    }
  }

  // Extract values from Clerk's payload — prefer nested data, fallback to HTML parsing
  const otpCode = (nestedData?.otp_code as string) || "";
  const magicLink = extractLink(clerkBody);
  const requestedFrom = (nestedData?.requested_from as string) || "";
  const requestedAt = (nestedData?.requested_at as string) || "";

  const html = renderClerkEmail(templateType, locale, {
    magic_link: magicLink,
    action_url: magicLink,
    otp_code: otpCode,
    ttl_minutes: "10",
    requested_from: requestedFrom,
    requested_at: requestedAt,
    inviter_name: data.inviter_name as string | undefined,
    inviter_email: data.inviter_email as string | undefined,
    user_email_address: emailAddress,
  });

  if (!resend) {
    console.warn("[clerk-webhook] RESEND_API_KEY not configured");
    return new NextResponse("Resend not configured", { status: 200 });
  }

  if (!emailAddress) {
    console.warn("[clerk-webhook] No recipient email found in payload");
    return new NextResponse("No recipient", { status: 200 });
  }

  try {
    let fromAddress = process.env.RESEND_FROM_EMAIL ?? "Faro <noreply@miguelweb.dev>";
    fromAddress = fromAddress.replace(/^"|"$/g, "");
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: emailAddress,
      subject: html.subject,
      html: html.html,
    });
    if (error) {
      console.error("[clerk-webhook] Resend API error:", error);
      return new NextResponse("Send failed", { status: 500 });
    }
  } catch (err) {
    console.error("[clerk-webhook] Resend send failed", err);
    return new NextResponse("Send failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
