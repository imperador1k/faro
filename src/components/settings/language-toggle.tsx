"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { syncNativeLanguage } from "@/actions/user-progress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const t = useTranslations("settings_components");
  const locale = useLocale();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState(locale);
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (code: string) => {
    if (code === currentLang) return;
    setCurrentLang(code);

    startTransition(() => {
      syncNativeLanguage(code)
        .then((res) => {
          if (res.success) {
            toast.success(
              t("language_updated", {
                defaultValue: "Language updated successfully!",
              }),
            );
            router.refresh(); // Triggers a reload from the server with the new locale
          } else {
            toast.error(
              t("language_error", {
                defaultValue: "Failed to update language",
              }),
            );
            setCurrentLang(locale); // Revert on failure
          }
        })
        .catch(() => {
          toast.error(
            t("language_error", { defaultValue: "Failed to update language" }),
          );
          setCurrentLang(locale); // Revert on failure
        });
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-stone-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 mt-6">
      <div>
        <h3 className="font-bold text-stone-700 dark:text-slate-200 text-lg">
          {t("app_language_title")}
        </h3>
        <p className="text-stone-500 dark:text-slate-400 text-sm">
          {t("app_language_description")}
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
