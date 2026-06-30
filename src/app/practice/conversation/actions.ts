"use server";

import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { generateTextWithFallback } from "@/lib/ai-manager";
import { getTranslations } from "next-intl/server";

export async function generateTutorResponse(userMessage: string) {
  const t = await getTranslations("practice");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  const activeLanguage = progress?.activeLanguage || "English";

  const systemPrompt = `You are a friendly, conversational native tutor for a student learning ${activeLanguage}. Keep your responses extremely brief (1-2 short sentences maximum) to simulate a fast-paced voice call. Respond strictly in ${activeLanguage}. Do not use emojis, asterisks, or markdown, just plain natural conversational text suitable for text-to-speech.`;

  try {
    const textResponse = await generateTextWithFallback(
      userMessage,
      systemPrompt,
      { maxOutputTokens: 150, temperature: 0.7 },
    );

    return {
      success: true,
      text: textResponse.trim(),
      language: activeLanguage,
    };
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      text: t("internal_error", { language: activeLanguage }),
      language: activeLanguage,
    };
  }
}

export async function getVoiceTutorSetup() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  const activeLanguage = progress?.activeLanguage || "English";
  const nativeLanguage = progress?.nativeLanguage || "pt-PT";

  // Parse CEFR levels to get the level for the active language
  const cefrLevels = (progress?.cefrLevels as Record<string, string>) || {};
  const cefrLevel = cefrLevels[activeLanguage] || "B1";

  // Use a public key variable or fallback to process.env
  // WARNING: For development/hobby, passing the key to the client for WebSockets.
  const apiKey = process.env.GEMINI_API_KEY || "";

  return {
    activeLanguage,
    nativeLanguage,
    cefrLevel,
    apiKey,
  };
}
