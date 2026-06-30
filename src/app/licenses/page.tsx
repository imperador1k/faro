import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Code,
  Atom,
  Layers,
  Palette,
  Database,
  Key,
  Sparkles,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("licenses");
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/licenses",
    },
  };
}

export default function LicensesPage() {
  const t = useTranslations("licenses");
  return (
    <div className="min-h-screen bg-[#fbf9f8] dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center border-2 border-stone-200 dark:border-slate-800 mb-2">
            <Code className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
            {t("title")}
          </h1>
          <div className="bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mt-4">
            {t("open_source_credits")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-black text-stone-700 dark:text-slate-200 mb-6">
            {t("technologies_used")}
          </h2>
          <p className="text-stone-500 dark:text-slate-400 font-medium mb-8">
            {t("intro_text")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* React */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Atom className="w-6 h-6 text-[#1CB0F6]" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    React
                  </h3>
                </div>
                <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] font-bold text-xs px-2 py-1 rounded-md">
                  MIT
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("react_desc")}
              </p>
            </div>

            {/* Next.js */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-stone-800 dark:text-slate-100" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    Next.js
                  </h3>
                </div>
                <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] font-bold text-xs px-2 py-1 rounded-md">
                  MIT
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("nextjs_desc")}
              </p>
            </div>

            {/* Tailwind CSS */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-6 h-6 text-[#38BDF8]" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    Tailwind CSS
                  </h3>
                </div>
                <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] font-bold text-xs px-2 py-1 rounded-md">
                  MIT
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("tailwind_desc")}
              </p>
            </div>

            {/* Drizzle ORM */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-[#C4E456]" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    Drizzle ORM
                  </h3>
                </div>
                <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] font-bold text-xs px-2 py-1 rounded-md">
                  Apache 2.0
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("drizzle_desc")}
              </p>
            </div>

            {/* Clerk */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-6 h-6 text-indigo-500" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    Clerk
                  </h3>
                </div>
                <span className="bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300 font-bold text-xs px-2 py-1 rounded-md">
                  {t("proprietary")}
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("clerk_desc")}
              </p>
            </div>

            {/* Gemini API */}
            <div className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-4 rounded-2xl p-5 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  <h3 className="font-bold text-lg text-stone-700 dark:text-slate-200">
                    Google Gemini
                  </h3>
                </div>
                <span className="bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300 font-bold text-xs px-2 py-1 rounded-md">
                  {t("proprietary")}
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-slate-400 font-medium">
                {t("gemini_desc")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/settings"
            className="bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 border-b-4 border-stone-300 dark:border-slate-700 active:translate-y-1 active:border-b-0 hover:bg-stone-300 dark:bg-slate-600 rounded-2xl px-12 py-5 font-black uppercase tracking-widest text-center block w-full md:w-auto transition-all"
          >
            {t("back_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
