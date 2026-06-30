import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CallRoomClient } from "./CallRoomClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("practice_page");
  return {
    title: t("conversation_title"),
  };
}

export default async function ConversationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!progress) {
    redirect("/");
  }

  return <CallRoomClient activeLanguage={progress.activeLanguage} />;
}
