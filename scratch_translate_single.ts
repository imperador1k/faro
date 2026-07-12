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
  const messagesDir = path.join(process.cwd(), "messages");
  const ptPath = path.join(messagesDir, "pt.json");
  const ptData = JSON.parse(fs.readFileSync(ptPath, "utf8"));
  const itemsPt = ptData.quests.items;

  const langs = ["ar", "de", "en", "es", "fr", "hi", "it", "ja", "uk"];
  // Map codes to full language names for better prompting
  const langNames: Record<string, string> = {
    ar: "Arabic",
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
    hi: "Hindi",
    it: "Italian",
    ja: "Japanese",
    uk: "Ukrainian",
  };

  for (const lang of langs) {
    console.log("Translating to " + langNames[lang] + "...");
    const prompt =
      "Translate the following achievements JSON from Portuguese to " +
      langNames[lang] +
      ". Return a single JSON object with the exact same keys as the input, containing the translated 'title' and 'description'. Ensure that placeholders like XP remain unchanged.\n\nInput JSON:\n" +
      JSON.stringify(itemsPt, null, 2);

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const translatedItems = JSON.parse(responseText);

      const filePath = path.join(messagesDir, lang + ".json");
      if (fs.existsSync(filePath)) {
        const langData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (!langData.quests) langData.quests = {};
        langData.quests.items = translatedItems;
        fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
        console.log("Updated " + lang + ".json successfully.");
      }
    } catch (err) {
      console.error("Failed for " + lang + ": ", err);
    }
  }
  console.log("All languages processed!");
}

main().catch(console.error);
