import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Termos de Utilização",
  description:
    "Lê os termos e condições de utilização da plataforma Faro e os teus direitos como utilizador.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const t = useTranslations("terms");
  return (
    <div className="min-h-screen bg-[#fbf9f8] dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center border-2 border-stone-200 dark:border-slate-800 mb-2">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
            {t("title")}
          </h1>
          <div className="bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mt-4">
            {t("last_updated")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("agreement_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("intro_1")}</p>
            <p>{t("intro_2")}</p>
            <p>{t("intro_3")}</p>
            <p>{t("intro_4")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_1_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_1_content")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_2_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>
              {t.rich("section_2_p1", {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("section_2_p2", {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("section_2_p3", {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_3_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_3_p1")}</p>
            <p>{t("section_3_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_4_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_4_p1")}</p>
            <p>{t("section_4_p2")}</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-stone-300">
              <li>{t("section_4_list_1")}</li>
              <li>{t("section_4_list_2")}</li>
              <li>{t("section_4_list_3")}</li>
              <li>{t("section_4_list_4")}</li>
              <li>{t("section_4_list_5")}</li>
              <li>{t("section_4_list_6")}</li>
              <li>{t("section_4_list_7")}</li>
              <li>{t("section_4_list_8")}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_5_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_5_p1")}</p>
            <p>{t("section_5_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_7_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_7_p1")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_8_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_8_p1")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_9_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_9_p1")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_10_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_10_p1")}</p>
            <p>{t("section_10_p2")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_12_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_12_p1")}</p>
            <p>{t("section_12_p2")}</p>
            <p>{t("section_12_p3")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 mb-8 transition-all hover:bg-stone-50 dark:hover:bg-slate-800">
          <h2 className="text-2xl font-black text-[#1CB0F6] mb-4">
            {t("section_16_title")}
          </h2>
          <div className="space-y-4 text-lg text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>{t("section_16_p1")}</p>
            <p>{t("section_16_p2")}</p>
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
