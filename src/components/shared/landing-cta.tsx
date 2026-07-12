"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface LandingCTAProps {
  userId: string | null;
}

export const LandingCTA = ({ userId }: LandingCTAProps) => {
  const t = useTranslations("shared");
  const playClick = () => {
    const audio = new Audio("/click_button.mp3");
    audio.play().catch(() => {
      // Ignore errors (e.g. user hasn't interacted with the page yet)
    });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {userId ? (
        <Link href="/learn" className="w-full">
          <Button
            size="lg"
            className="relative w-full h-14 bg-[#58cc02] border-2 border-[#58cc02] border-b-[6px] border-b-[#46a302] active:border-b-2 active:translate-y-[4px] rounded-2xl flex items-center justify-center text-white font-black text-base uppercase tracking-widest transition-all hover:bg-[#46a302] hover:border-[#46a302]"
            onClick={playClick}
          >
            {t("continue_course")}
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/onboarding" className="w-full">
            <Button
              size="lg"
              className="relative w-full h-14 bg-[#58cc02] border-2 border-[#58cc02] border-b-[6px] border-b-[#46a302] active:border-b-2 active:translate-y-[4px] rounded-2xl flex items-center justify-center text-white font-black text-base uppercase tracking-widest transition-all hover:bg-[#46a302] hover:border-[#46a302]"
              onClick={playClick}
            >
              {t("start_now")}
            </Button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <Button
              variant="ghost"
              size="lg"
              className="relative w-full h-14 bg-white dark:bg-slate-900 text-[#1cb0f6] hover:text-[#1899d6] font-black uppercase tracking-widest border-2 border-slate-200 dark:border-slate-800 border-b-[6px] active:border-b-2 active:translate-y-[4px] rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center justify-center text-base"
              onClick={playClick}
            >
              {t("already_have_an_account")}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
