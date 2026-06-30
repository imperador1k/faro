"use server";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function translateWord(
  word: string,
  context: string,
  targetLang: string,
) {
  try {
    const cleanWord = word.replace(/[^a-zA-ZÀ-ÿ-]/g, "").toLowerCase();
    if (!cleanWord) return null;

    // Create a deterministic cache key based on the word and a hash/snippet of the context
    // This ensures that "banco" in "vou ao banco" has a different cache than "banco de jardim"
    const contextHash = Buffer.from(context.substring(0, 60)).toString(
      "base64",
    );
    const cacheKey = `dict:${cleanWord}:${contextHash}:${targetLang}`;

    // 1. Check Redis Cache
    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cleanWord}`);
      return cached;
    }

    // 2. Cache Miss: Ask Groq LLM (Contextual Translation)
    console.log(`[CACHE MISS] Translating '${cleanWord}' via Groq...`);
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
              content: `You are a strict translation assistant. You will be given a specific word and the context sentence where it appears. Your ONLY goal is to translate that specific word to ${targetLang}, taking the context into account. Reply ONLY with the translated word, nothing else. Do not add punctuation. Keep it lowercased.`,
            },
            {
              role: "user",
              content: `Word to translate: "${cleanWord}"
Context sentence: "${context}"`,
            },
          ],
          temperature: 0.1,
          max_tokens: 10,
        }),
      },
    );

    if (!groqRes.ok) {
      throw new Error("Failed to fetch from Groq API");
    }

    const data = await groqRes.json();
    const translation = data.choices[0].message.content
      .trim()
      .replace(/['".,?!]/g, "")
      .toLowerCase();

    if (translation) {
      // 3. Save the result in Redis permanently (No expiration, ultra scalable)
      await redis.set(cacheKey, translation);
      return translation;
    }

    return null;
  } catch (error) {
    console.error("[TRANSLATION_ERROR]", error);
    return null;
  }
}
