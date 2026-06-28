import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { knowledgePosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 60; // Allow edge/serverless to run longer on Pro (ignored on free if over limit)

export async function GET(req: Request) {
  // Validate Cron Secret
  const authHeader = req.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    // 1. Prompt Groq to generate 5 random facts directly (Bypassing Reddit's anti-bot protection)
    const prompt = `
You are an expert language teacher and educational content creator.
Generate exactly 5 highly interesting, verified trivia facts.
Convert these facts into Português adapted for a B1 learner.
Keep the language natural but accessible. Use common vocabulary.

You must reply with a STRICT JSON object containing an array called "facts".
Each object in the array must have exactly these fields:
{
  "title": "A short, engaging title in Portuguese (max 6 words).",
  "category": "One of: TECHNOLOGY, HISTORY, SCIENCE, CULTURE, RANDOM.",
  "body": "The translated fact, split into 2-3 short sentences. Max 350 characters total.",
  "imageKeyword": "A single english word representing the exact subject of the fact (e.g., 'computer', 'volcano', 'dog', 'castle')."
}

Example valid JSON response:
{
  "facts": [
    {
      "title": "A Primeira Sopa de Frango",
      "category": "CULTURE",
      "body": "A sopa de frango é famosa mundialmente. Ela chegou aos EUA em 1920.",
      "imageKeyword": "soup"
    }
  ]
}
`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "system", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3, // Lower temperature to prevent JSON syntax errors
        }),
      },
    );

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq Error:", errorText);
      throw new Error(`Groq API Error: ${errorText}`);
    }

    const groqData = await groqRes.json();
    const content = JSON.parse(groqData.choices[0].message.content);
    const facts = content.facts || [];

    const insertedIds = [];

    // 2. Insert to DB
    for (const fact of facts) {
      // Assign BG Color based on category
      const bgMap: Record<string, string> = {
        TECHNOLOGY: "from-cyan-900 to-black",
        HISTORY: "from-amber-900 to-black",
        SCIENCE: "from-emerald-900 to-black",
        CULTURE: "from-purple-900 to-black",
        RANDOM: "from-rose-900 to-black",
      };

      const bgClass = bgMap[fact.category] || "from-slate-900 to-black";

      const [inserted] = await db
        .insert(knowledgePosts)
        .values({
          originalSourceUrl: `https://loremflickr.com/800/1200/${fact.imageKeyword || fact.category}?lock=${Math.floor(Math.random() * 1000000)}`,
          targetLanguage: "Português",
          cefrLevel: "B1",
          title: fact.title,
          category: fact.category,
          body: fact.body,
          author: "Llama 3.1",
          authorImg: "https://groq.com/favicon.ico",
          bgClass,
          status: "APPROVED",
        })
        .returning({ id: knowledgePosts.id });

      insertedIds.push(inserted.id);
    }

    return NextResponse.json({
      success: true,
      processed: insertedIds.length,
      ids: insertedIds,
    });
  } catch (error: any) {
    console.error("[CRON_INGEST_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
