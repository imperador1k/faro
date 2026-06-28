"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export const LanguageToggle = () => {
  // Mock state (defaults to native language in the future)
  const [currentLang, setCurrentLang] = useState("pt");

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    // TODO: In the future, this will call the next-intl setCookie action
    // and potentially reload the router to apply translations!
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-stone-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 mt-6">
      <div>
        <h3 className="font-bold text-stone-700 dark:text-slate-200 text-lg">
          Idioma da App (Em breve)
        </h3>
        <p className="text-stone-500 dark:text-slate-400 text-sm">
          Escolhe a língua em que queres explorar o MyDuolingo.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <Button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              variant={isActive ? "secondary" : "ghost"}
              className={`h-auto py-3 flex flex-col gap-1 rounded-xl transition-all ${
                isActive
                  ? "bg-[#1CB0F6]/10 text-[#1CB0F6] hover:bg-[#1CB0F6]/20 border-2 border-[#1CB0F6]/30 border-b-4 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-700"
                  : "border-2 border-stone-200 dark:border-slate-800 border-b-4 dark:text-slate-400 dark:hover:bg-slate-800 hover:bg-stone-100"
              }`}
            >
              <span className="text-2xl drop-shadow-sm">{lang.flag}</span>
              <span className="text-xs font-bold tracking-wide">
                {lang.name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
