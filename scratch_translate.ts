import fs from "fs";
import path from "path";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("No API key found.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

async function main() {
  const diffContent = fs.readFileSync("achievements_diff_utf8.txt", "utf8");
  const itemsPt: Record<string, { title: string; description: string }> = {};

  let currentId = "";
  let currentTitle = "";
  let currentDesc = "";

  const lines = diffContent.split("\n");
  for (const line of lines) {
    if (line.startsWith("+    id: ")) {
      currentId = line.match(/"([^"]+)"/)?.[1] || "";
    } else if (line.startsWith("-    title: ")) {
      currentTitle = line.match(/"([^"]+)"/)?.[1] || "";
    } else if (line.startsWith("-    description: ")) {
      currentDesc = line.match(/"([^"]+)"/)?.[1] || "";
      if (currentId && currentTitle && currentDesc) {
        itemsPt[currentId] = { title: currentTitle, description: currentDesc };
        currentId = "";
        currentTitle = "";
        currentDesc = "";
      }
    }
  }

  // Also write Portuguese directly
  const messagesDir = path.join(process.cwd(), "messages");
  const ptPath = path.join(messagesDir, "pt.json");
  const ptData = JSON.parse(fs.readFileSync(ptPath, "utf8"));
  if (!ptData.quests.items) ptData.quests.items = {};
  for (const [id, data] of Object.entries(itemsPt)) {
    ptData.quests.items[id] = data;
  }
  fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
  console.log("Updated pt.json locally.");

  console.log("Extracted " + Object.keys(itemsPt).length + " items from diff.");

  const prompt =
    "Translate the following achievements JSON from Portuguese into 9 target languages: Arabic (ar), German (de), English (en), Spanish (es), French (fr), Hindi (hi), Italian (it), Japanese (ja), Ukrainian (uk). Return a JSON object with those 9 language codes as root keys, each containing the same structure as the input but translated appropriately for a language learning app like Duolingo. Ensure that placeholders like XP remain unchanged.\n\nInput JSON:\n" +
    JSON.stringify(itemsPt, null, 2);

  console.log("Calling Gemini to translate...");
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const parsed = JSON.parse(responseText);

  for (const lang of Object.keys(parsed)) {
    const filePath = path.join(messagesDir, lang + ".json");
    if (fs.existsSync(filePath)) {
      const langData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!langData.quests) langData.quests = {};
      langData.quests.items = parsed[lang];
      fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
      console.log("Updated " + lang + ".json");
    }
  }

  console.log("Translation complete!");
}

main().catch(console.error);
