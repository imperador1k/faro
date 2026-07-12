import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

async function main() {
  const messagesDir = path.join(process.cwd(), "messages");
  const ptPath = path.join(messagesDir, "pt.json");
  const ptData = JSON.parse(fs.readFileSync(ptPath, "utf8"));
  const itemsPt = ptData.quests.items;

  console.log("Translating to English...");
  const prompt =
    "Translate the following achievements JSON from Portuguese to English. Return a single JSON object with the exact same keys as the input, containing the translated 'title' and 'description'. Ensure that placeholders like XP remain unchanged.\n\nInput JSON:\n" +
    JSON.stringify(itemsPt, null, 2);

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const translatedItems = JSON.parse(responseText);

    const filePath = path.join(messagesDir, "en.json");
    const langData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    langData.quests.items = translatedItems;
    fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
    console.log("Updated en.json successfully.");
  } catch (err) {
    console.error("Failed for en: ", err);
  }
}
main().catch(console.error);
