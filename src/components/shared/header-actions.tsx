"use client";

import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

export const HeaderActions = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (langCode: string) => {
    if (langCode === locale) {
      setIsOpen(false);
      return;
    }
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`;
    setIsOpen(false);
    router.refresh();
  };

  if (!mounted) return <div className="flex items-center gap-2 h-11 w-24"></div>;

  return (
    <div className="flex items-center gap-3">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        onClick={toggleTheme}
        className="flex h-11 w-11 items-center justify-center rounded-xl"
      >
        {resolvedTheme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
      </Button>

      {/* Language Selector */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl px-4 font-bold uppercase tracking-wide"
        >
          <Languages size={20} />
          {locale}
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant="ghost"
                onClick={() => changeLanguage(lang.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-bold justify-start ${
                  locale === lang.code
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
                    : "text-stone-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
