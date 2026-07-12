import fs from "fs";
import path from "path";

// 1. Read achievements.ts to get all IDs
const achievementsContent = fs.readFileSync(
  "src/constants/achievements.ts",
  "utf8",
);

// Regex to find all id: "..."
const idRegex = /id:\s*"([^"]+)"/g;
const allIds = [];
let match;
while ((match = idRegex.exec(achievementsContent)) !== null) {
  allIds.push(match[1]);
}

console.log("Found " + allIds.length + " achievements.");

function toTitleCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const messagesDir = path.join(process.cwd(), "messages");
const langs = ["ar", "de", "en", "es", "fr", "hi", "it", "ja", "pt", "uk"];

for (const lang of langs) {
  const langPath = path.join(messagesDir, lang + ".json");
  if (fs.existsSync(langPath)) {
    const langData = JSON.parse(fs.readFileSync(langPath, "utf8"));
    if (!langData.quests) langData.quests = {};
    if (!langData.quests.items) langData.quests.items = {};

    // Ensure every ID exists
    for (const id of allIds) {
      if (!langData.quests.items[id]) {
        langData.quests.items[id] = {
          title: toTitleCase(id),
          description: "Desbloqueia " + toTitleCase(id),
        };
      }
    }

    fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
    console.log("Updated " + lang + ".json with missing items.");
  }
}
console.log("Fallback complete!");
