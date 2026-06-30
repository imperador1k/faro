"use client";

import { useTranslations } from "next-intl";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-stone-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
      <div>
        <h3 className="font-bold text-stone-700 dark:text-slate-200 text-lg">
          {t("title")}
        </h3>
        <p className="text-stone-500 dark:text-slate-400 text-sm">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => setTheme("light")}
          variant={theme === "light" ? "secondary" : "ghost"}
          className={`h-auto py-3 flex flex-col gap-2 rounded-xl transition-all ${theme === "light" ? "bg-sky-100 text-sky-500 hover:bg-sky-200 border-2 border-sky-200 border-b-4" : "border-2 border-stone-200 dark:border-slate-800 border-b-4 dark:text-slate-400 dark:hover:bg-slate-800"}`}
        >
          <Sun className="h-6 w-6" />
          <span>{t("light")}</span>
        </Button>

        <Button
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "secondary" : "ghost"}
          className={`h-auto py-3 flex flex-col gap-2 rounded-xl transition-all ${theme === "dark" ? "bg-indigo-900 text-indigo-300 hover:bg-indigo-800 border-2 border-indigo-700 border-b-4" : "border-2 border-stone-200 dark:border-slate-800 border-b-4 dark:text-slate-400 dark:hover:bg-slate-800"}`}
        >
          <Moon className="h-6 w-6" />
          <span>{t("dark")}</span>
        </Button>

        <Button
          onClick={() => setTheme("system")}
          variant={theme === "system" ? "secondary" : "ghost"}
          className={`h-auto py-3 flex flex-col gap-2 rounded-xl transition-all ${theme === "system" ? "bg-stone-200 text-stone-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-stone-300 border-2 border-stone-300 dark:border-slate-600 border-b-4" : "border-2 border-stone-200 dark:border-slate-800 border-b-4 dark:text-slate-400 dark:hover:bg-slate-800"}`}
        >
          <Monitor className="h-6 w-6" />
          <span>{t("system")}</span>
        </Button>
      </div>
    </div>
  );
};
