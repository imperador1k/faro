import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Aviso de Privacidade",
  description:
    "Consulta como o Faro protege os teus dados e gere a tua privacidade enquanto aprendes idiomas.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  return (
    <div className="min-h-screen bg-[#fbf9f8] dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center border-2 border-stone-200 dark:border-slate-800 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
            {t("title")}
          </h1>
          <div className="bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mt-4">
            {t("last_update")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("welcome_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("welcome_p1")}</p>
            <p>{t("welcome_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section1_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>
              {t.rich("section1_p1", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("section1_p2", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("section1_p3", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section23_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section23_p1")}</p>
            <p>{t("section23_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section45_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section45_p1")}</p>
            <p>{t("section45_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section6_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section6_p1")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section7_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>
              {t.rich("section7_p1", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("section7_p2", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section8_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section8_p1")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section910_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section910_p1")}</p>
            <p>{t("section910_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section11_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section11_p1")}</p>
            <p>{t("section11_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section1216_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section1216_p1")}</p>
            <p>{t("section1216_p2")}</p>
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
