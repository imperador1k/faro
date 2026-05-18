import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

export async function generateTextWithFallback(
  prompt: string,
  systemInstruction?: string,
  generationConfig?: GenerationConfig,
): Promise<string> {
  // 1. Find all environment variables that start with 'GEMINI_API_KEY_'
  let keys = Object.keys(process.env)
    .filter((k) => k.startsWith("GEMINI_API_KEY_"))
    .map((k) => process.env[k])
    .filter((k): k is string => !!k);

  // Add the singular key as a fallback if present
  if (
    process.env.GEMINI_API_KEY &&
    !keys.includes(process.env.GEMINI_API_KEY)
  ) {
    keys.push(process.env.GEMINI_API_KEY);
  }

  if (keys.length === 0) {
    throw new Error("CRITICAL: No Gemini keys found in environment variables.");
  }

  // 2. Shuffle keys to distribute load (Round-Robin logic)
  const shuffledKeys = keys.sort(() => 0.5 - Math.random());

  let lastError: Error | unknown;

  for (const key of shuffledKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
        generationConfig: generationConfig,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(new Error("Timeout: Gemini API took too long to respond.")),
          15000,
        );
      });

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]);

      return result.response.text();
    } catch (error) {
      console.warn(`[AI Manager] Key failed, attempting fallback...`);
      lastError = error;
    }
  }

  console.error("[AI Manager] CRITICAL: ALL keys exhausted or failed.");
  throw lastError;
}
