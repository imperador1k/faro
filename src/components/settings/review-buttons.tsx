"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useReviewModal } from "@/store/use-review-modal-store";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const ReviewButtons = () => {
  const t = useTranslations("settings_components");
  const { open: openReviewModal } = useReviewModal();

  return (
    <>
      <Link
        href="/reviews"
        className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-6 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 border-b-2 border-purple-200 group-hover:bg-purple-500 transition-colors">
          <Heart className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
        </div>
        <span className="font-bold text-stone-700 dark:text-slate-200">
          {t("feedback_wall")}
        </span>
      </Link>

      <Button
        onClick={openReviewModal}
        variant="default"
        className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md group text-left w-full h-auto"
      >
        <div className="h-10 w-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0 border-b-2 border-yellow-200 group-hover:bg-yellow-400 transition-colors">
          <Star className="h-5 w-5 text-yellow-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-stone-700 dark:text-slate-200">
            {t("give_feedback")}
          </span>
          <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
            {t("help_us_grow")}
          </span>
        </div>
      </Button>
    </>
  );
};
