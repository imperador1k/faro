import fs from "fs";
import path from "path";
import { getAchievements } from "./src/constants/achievements";

// Mock translation function to return the key
const mockT = (key: string) => key;
const achievements = getAchievements(mockT);

const items = {};

function toTitleCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

for (const a of achievements) {
  if (a.id) {
    items[a.id] = {
      title: toTitleCase(a.id),
      description: "Desbloqueia " + toTitleCase(a.id),
    };
  }
}

const messagesDir = path.join(process.cwd(), "messages");
const langs = ["ar", "de", "en", "es", "fr", "hi", "it", "ja", "pt", "uk"];

for (const lang of langs) {
  const langPath = path.join(messagesDir, lang + ".json");
  if (fs.existsSync(langPath)) {
    const langData = JSON.parse(fs.readFileSync(langPath, "utf8"));
    if (!langData.quests) langData.quests = {};
    // overwrite items completely with the correct aligned keys
    langData.quests.items = items;
    fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
    console.log("Updated " + lang + ".json with clean items");
  }
}
