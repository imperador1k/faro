import { redirect } from "next/navigation";
import { getWeakVocabulary, getUserProgress } from "@/db/queries";
import { VocabularySprint } from "@/components/shared/vocabulary-sprint";
import { Archive } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Treino de Vocabulário | MyDuolingo",
  description: "Treina as tuas palavras mais fracas no Sprint de Vocabulário.",
};

const VocabularyPracticePage = async () => {
  const t = await getTranslations("practice");
  const userProgressData = await getUserProgress();

  if (!userProgressData?.activeCourseId) {
    return redirect("/courses");
  }

  const activeLanguage =
    userProgressData.activeLanguage || t("default_language");
  const weakWords = await getWeakVocabulary();

  if (weakWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
          <Archive className="h-16 w-16 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          {t("no_weak_words", { language: activeLanguage })}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium mb-6">
          {t("come_back_later")}
        </p>
        <Link
          href="/vocabulary"
          className="font-bold text-lg px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all active:scale-95"
        >
          {t("back_to_vault")}
        </Link>
      </div>
    );
  }

  return <VocabularySprint words={weakWords} language={activeLanguage} />;
};

export default VocabularyPracticePage;
