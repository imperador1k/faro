import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const MESSAGES_FILE = "./messages/pt.json";
const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: 8192,
  },
});

const getSystemPrompt = (namespace: string) => `
You are an elite Next.js (App Router) and i18n expert.
Your job is to refactor a given file to use 'next-intl'.
The file currently has hardcoded user-facing Portuguese text.

CRITICAL INSTRUCTION: To avoid token limits, DO NOT return the entire refactored file. 
Instead, return a JSON object with:
1. "imports": A string containing the import statement to add at the top (e.g. "import { useTranslations } from 'next-intl';").
2. "hooks": A string containing the hook to inject inside the component (e.g. "const t = useTranslations('${namespace}');").
3. "replacements": An array of objects, where each object has:
   - "search": The EXACT string of code to replace (must match perfectly, including spaces and quotes).
   - "replace": The EXACT string to replace it with.
4. "extractedKeys": A JSON object of keys and values.

Example:
{
  "imports": "import { useTranslations } from 'next-intl';\\n",
  "hooks": "  const t = useTranslations('${namespace}');\\n",
  "replacements": [
    {
      "search": "<h1 className=\\"title\\">Olá Mundo</h1>",
      "replace": "<h1 className=\\"title\\">{t('hello_world')}</h1>"
    }
  ],
  "extractedKeys": {
    "hello_world": "Olá Mundo"
  }
}

Do NOT extract programming strings like className="text-white" or IDs.
HTML/React elements inside translations must use t.rich().
`;

async function processFile(filePath: string) {
  console.log(`\\n⏳ A tentar recuperar: ${filePath}...`);
  if (!existsSync(filePath)) {
    console.error(`Ficheiro não encontrado: ${filePath}`);
    return;
  }

  let namespace = "common";
  if (filePath.includes("shop")) namespace = "shop";
  else if (filePath.includes("profile")) namespace = "profile";
  else if (filePath.includes("friends")) namespace = "friends";
  else if (filePath.includes("vocabulary")) namespace = "vocabulary";
  else if (filePath.includes("quests")) namespace = "quests";
  else if (filePath.includes("reviews")) namespace = "reviews";
  else if (filePath.includes("arcade")) namespace = "arcade";
  else if (filePath.includes("practice")) namespace = "practice";
  else if (filePath.includes("lesson")) namespace = "lesson";
  else if (filePath.includes("docs")) namespace = "docs";
  else if (filePath.includes("support")) namespace = "support";
  else if (filePath.includes("ui")) namespace = "ui";
  else if (filePath.includes("shared")) namespace = "shared";
  else if (filePath.includes("modals")) namespace = "modals";
  else if (filePath.includes("learn")) namespace = "learn";
  else if (filePath.includes("leaderboard")) namespace = "leaderboard";
  else if (filePath.includes("chat")) namespace = "chat";
  else if (filePath.includes("settings")) namespace = "settings";

  const originalCode = readFileSync(filePath, "utf-8");

  let attempts = 0;
  while (attempts < 3) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: originalCode }] }],
        systemInstruction: {
          parts: [{ text: getSystemPrompt(namespace) }],
          role: "system",
        },
      });

      let responseText = result.response.text();
      const firstBrace = responseText.indexOf("{");
      const lastBrace = responseText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        responseText = responseText.slice(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(responseText);

      let newCode = originalCode;

      // Apply replacements
      for (const r of parsed.replacements || []) {
        newCode = newCode.replace(r.search, r.replace);
      }

      // Inject imports at top
      if (parsed.imports && !newCode.includes("next-intl")) {
        newCode = parsed.imports + "\\n" + newCode;
      }

      // Inject hook inside the first exported function (simple heuristic)
      if (parsed.hooks && !newCode.includes(parsed.hooks.trim())) {
        const match = newCode.match(
          /export (default )?(async )?function [a-zA-Z0-9_]+\\([^)]*\\) \\{/,
        );
        if (match) {
          const insertPos = match.index! + match[0].length;
          newCode =
            newCode.slice(0, insertPos) +
            "\\n" +
            parsed.hooks +
            newCode.slice(insertPos);
        }
      }

      writeFileSync(filePath, newCode, "utf-8");
      console.log(`✅ Ficheiro recuperado: ${filePath}`);

      const currentMessages = existsSync(MESSAGES_FILE)
        ? JSON.parse(readFileSync(MESSAGES_FILE, "utf-8"))
        : {};
      currentMessages[namespace] = {
        ...(currentMessages[namespace] || {}),
        ...(parsed.extractedKeys || {}),
      };

      writeFileSync(
        MESSAGES_FILE,
        JSON.stringify(currentMessages, null, 2),
        "utf-8",
      );
      return;
    } catch (error: any) {
      if (
        error.status === 429 ||
        error.status === 503 ||
        (error.message &&
          (error.message.includes("429") || error.message.includes("503")))
      ) {
        console.warn(`⏳ Rate Limit. Esperando 10s...`);
        await new Promise((r) => setTimeout(r, 10000));
        attempts++;
      } else {
        console.error(
          `❌ Erro no ficheiro ${filePath}:`,
          error.message || error,
        );
        return;
      }
    }
  }
}

async function run() {
  console.log(`🚀 A iniciar Recuperação de Erros via Gemini 3.1 Flash Lite...`);
  const lines = readFileSync("./messages/errors.log", "utf8").split("\n");
  const files = new Set<string>();
  lines.forEach((l) => {
    if (!l.trim()) return;
    const m = l.match(/Erro no ficheiro: (.*?) \|/);
    if (m) files.add(m[1].trim());
  });

  for (const file of Array.from(files)) {
    await processFile(file);
    await new Promise((r) => setTimeout(r, 7000));
  }
  console.log(`\\n🎉 Recuperação finalizada!`);
}

run();
