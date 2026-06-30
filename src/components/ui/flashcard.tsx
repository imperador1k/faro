"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Activity, RotateCcw } from "lucide-react";

interface FlashcardProps {
  word: string;
  translation: string;
  explanation: string;
  contextSentence: string | null;
  language: string | null;
  strength: number;
}

const useStrengthLabels = () => {
  const t = useTranslations("flashcard.strengths");
  return {
    1: {
      label: t("seed"),
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    2: {
      label: t("sprout"),
      color: "text-lime-600 bg-lime-50 border-lime-200",
    },
    3: {
      label: t("tree"),
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    4: {
      label: t("master"),
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
  };
};

export const Flashcard = ({
  word,
  translation,
  explanation,
  contextSentence,
  language,
  strength,
}: FlashcardProps) => {
  const t = useTranslations("ui");
  const [isFlipped, setIsFlipped] = useState(false);

  const clozedSentence = contextSentence
    ? contextSentence.replace(new RegExp(`\\b${word}\\b`, "gi"), "_______")
    : null;

  const strengthLabels = useStrengthLabels();
  const strengthInfo =
    strengthLabels[strength as keyof typeof strengthLabels] ||
    strengthLabels[1];

  return (
    <div
      className="group relative min-h-[300px] w-full cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 transform-style-3d rounded-2xl",
          "shadow-sm hover:shadow-lg hover:shadow-slate-200/60",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* ═══ FRONT ═══ */}
        <div className="absolute inset-0 h-full w-full backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden">
          {/* Top badges - Absolute to be "transparent" to flow */}
          <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex items-center justify-between z-10">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
                strengthInfo.color,
              )}
            >
              <Activity className="h-3 w-3" />
              {strengthInfo.label}
            </div>
            {language && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
                {language}
              </span>
            )}
          </div>

          {/* Content area */}
          <div className="flex flex-col items-center text-center justify-center flex-1 gap-3 w-full px-2 pt-12 pb-6">
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 break-words hyphens-auto text-center w-full leading-tight">
              {word}
            </h3>
            {clozedSentence && (
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed italic break-words w-full max-w-md">
                &quot;{clozedSentence}&quot;
              </p>
            )}
          </div>

          {/* Bottom hint - St stays at the end of the scroll if content is long */}
          <p className="text-[11px] text-center text-slate-400 font-bold uppercase tracking-widest pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 mt-auto">
            <RotateCcw className="h-3 w-3" />
            {t("click_to_reveal")}
          </p>
        </div>

        {/* ═══ BACK ═══ */}
        <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden">
          {/* Top badge - Absolute */}
          <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex justify-end z-10">
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase">
                {t("translation")}
              </span>
            </div>
          </div>

          {/* Content area */}
          <div className="flex flex-col items-center text-center justify-center flex-1 gap-3 w-full px-2 pt-12 pb-6">
            <h3 className="text-2xl md:text-3xl font-black text-emerald-600 break-words hyphens-auto text-center w-full leading-tight">
              {translation}
            </h3>

            {explanation && (
              <p className="text-base font-medium text-emerald-800/80 leading-relaxed break-words w-full max-w-md">
                {explanation}
              </p>
            )}

            {contextSentence && (
              <p className="text-sm text-emerald-700/60 italic break-words w-full max-w-md mt-1">
                &quot;{contextSentence}&quot;
              </p>
            )}
          </div>

          {/* Bottom hint */}
          <p className="text-[11px] text-center text-emerald-400 font-bold uppercase tracking-widest pt-3 border-t border-emerald-200/50 w-full flex items-center justify-center gap-1.5 mt-auto">
            <RotateCcw className="h-3 w-3" />
            {t("click_to_return")}
          </p>
        </div>
      </div>
    </div>
  );
};
