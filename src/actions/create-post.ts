"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { knowledgePosts } from "@/db/schema";
import { revalidatePath } from "next/cache";

type CreatePostInput = {
  title: string;
  body: string;
  category: string;
  cefrLevel: string;
  imageBase64: string | null;
};

export const createUserPost = async (input: CreatePostInput) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { success: false, error: "Não estás autenticado." };
  }

  try {
    await db.insert(knowledgePosts).values({
      title: input.title,
      body: input.body,
      category: input.category,
      targetLanguage: "original", // Wait for admin approval to translate
      cefrLevel: input.cefrLevel,
      imageBase64: input.imageBase64,
      authorId: userId,
      author: user.firstName || "User",
      authorImg: user.imageUrl || "https://i.pravatar.cc/150",
      status: "PENDING" as any, // REQUIRES ADMIN APPROVAL
      bgClass: "from-slate-900 to-black",
    });

    revalidatePath("/admin/feed");
    return { success: true };
  } catch (error) {
    console.error("Error creating user post:", error);
    return { success: false, error: "Ocorreu um erro ao criar o post." };
  }
};
