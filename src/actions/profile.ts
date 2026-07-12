"use server";

import { auth } from "@clerk/nextjs/server";
import { actionError } from "@/lib/action-error";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  userName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  userImageSrc: z.string().optional(),
});

export const setupUserProfile = async (data: z.infer<typeof schema>) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return actionError("INVALID_PAYLOAD", "Invalid profile data");
  }

  const { userId } = await auth();
  if (!userId) {
    return actionError("UNAUTHORIZED", "Not authenticated");
  }

  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!existing) {
    return actionError("NOT_FOUND", "User progress not found");
  }

  const newPreferences = {
    ...(existing.clientPreferences as Record<string, unknown>),
    hasSetupProfile: true,
  };

  await db
    .update(userProgress)
    .set({
      userName: parsed.data.userName,
      userImageSrc: parsed.data.userImageSrc,
      clientPreferences: newPreferences,
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/");
  revalidatePath("/learn");

  return { success: true };
};
