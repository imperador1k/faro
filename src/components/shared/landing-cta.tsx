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
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wide border-b-4 border-green-700 h-12 rounded-xl"
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
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wide border-b-4 border-green-700 h-12 rounded-xl"
              onClick={playClick}
            >
              {t("start_now")}
            </Button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <Button
              variant="ghost"
              size="lg"
              className="w-full bg-white dark:bg-slate-900 text-blue-500 hover:bg-slate-50 dark:bg-slate-950 font-bold uppercase tracking-wide border-2 border-slate-200 dark:border-slate-800 border-b-4 h-12 rounded-xl active:border-b-2 hover:text-blue-600"
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
