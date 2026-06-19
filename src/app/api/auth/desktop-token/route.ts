import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/desktop-token
 *
 * Called by Chrome after a successful OAuth login on the desktop flow.
 * Generates a short-lived Clerk sign-in ticket (token) that the Tauri WebView
 * can use to create its own session — bypassing the cross-context nonce issue.
 *
 * Security: Only callable by an already-authenticated user (auth() guard).
 */
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const client = await clerkClient();
  const signInToken = await client.signInTokens.createSignInToken({
    userId,
    expiresInSeconds: 120, // 2 minutes — plenty of time to bounce to Tauri
  });

  return NextResponse.json({ token: signInToken.token });
}
