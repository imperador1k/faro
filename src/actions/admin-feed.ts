"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { knowledgePosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getPendingPosts = async () => {
  const { userId } = await auth();
  if (!userId) return []; // Should also check if user is admin, handled in layout

  const posts = await db.query.knowledgePosts.findMany({
    where: eq(knowledgePosts.status, "PENDING"),
    orderBy: [desc(knowledgePosts.createdAt)],
  });

  return posts;
};

export const updatePostStatus = async (
  postId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    if (status === "REJECTED") {
      await db.delete(knowledgePosts).where(eq(knowledgePosts.id, postId));
      revalidatePath("/admin/feed");
      return { success: true };
    }

    // Status is APPROVED: Translate and duplicate
    const originalPost = await db.query.knowledgePosts.findFirst({
      where: eq(knowledgePosts.id, postId),
    });

    if (!originalPost) {
      return { success: false, error: "Post original não encontrado" };
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                'You are an expert translator. Identify the original language of the text. Translate the title and body into these exactly 5 languages: English (\'en\'), Portuguese (\'pt\'), Spanish (\'es\'), French (\'fr\'), German (\'de\'). Output ONLY a raw JSON array of objects. Format: [{"lang": "en", "title": "...", "body": "..."}, ...]',
            },
            {
              role: "user",
              content: `Title: ${originalPost.title}\nBody: ${originalPost.body}`,
            },
          ],
          temperature: 0.1,
        }),
      },
    );

    if (!groqRes.ok) {
      console.error("Groq Error", await groqRes.text());
      return { success: false, error: "Erro no motor de tradução." };
    }

    const groqData = await groqRes.json();
    let translations = [];
    try {
      translations = JSON.parse(groqData.choices[0].message.content.trim());
    } catch (e) {
      console.error(
        "Failed to parse Groq response:",
        groqData.choices[0].message.content,
      );
      return { success: false, error: "Erro ao processar as traduções da IA." };
    }

    const postsToInsert = translations.map((t: any) => ({
      title: t.title,
      body: t.body,
      category: originalPost.category,
      targetLanguage: t.lang,
      cefrLevel: originalPost.cefrLevel,
      imageBase64: originalPost.imageBase64,
      authorId: originalPost.authorId,
      author: originalPost.author,
      authorImg: originalPost.authorImg,
      status: "APPROVED" as any,
      bgClass: originalPost.bgClass,
    }));

    await db.insert(knowledgePosts).values(postsToInsert);
    await db.delete(knowledgePosts).where(eq(knowledgePosts.id, postId));

    revalidatePath("/admin/feed");
    return { success: true };
  } catch (error) {
    console.error("Failed to update post status", error);
    return { success: false, error: "Failed to update status" };
  }
};
