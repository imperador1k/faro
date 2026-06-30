"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { HappyStarLottie } from "@/components/ui/lottie-animation";
import { useTranslations } from "next-intl";

export const StepPlacementResult = () => {
  const t = useTranslations("Onboarding");
  const { placementResults } = useOnboardingStore();

  const levelMap = {
    A1: { section: 1, label: t("level_a1"), bonus: 20 },
    A2: { section: 2, label: t("level_a2"), bonus: 50 },
    B1: { section: 3, label: t("level_b1"), bonus: 100 },
  };

  const result = placementResults?.level
    ? levelMap[placementResults.level]
    : levelMap["A1"];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center sm:justify-start sm:pt-6 text-center px-4 max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-2 sm:mb-4"
      >
        <HappyStarLottie className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2 sm:space-y-3"
      >
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#042c60] leading-tight">
            {t("amazing_title")}
          </h2>
          <p className="text-lg sm:text-xl font-black text-[#58cc02]">
            {t.rich("power_accumulated", {
              span: (chunks) => (
                <span className="underline decoration-4 underline-offset-4">
                  {chunks}
                </span>
              ),
            })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border-4 border-[#e5e5e5] rounded-3xl p-4 sm:p-6 shadow-[0_6px_0_#e5e5e5] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="space-y-4">
            <p className="text-base sm:text-lg font-bold text-gray-600 relative z-10">
              {t("placement_explanation", {
                score: placementResults?.score ?? 0,
              })}
            </p>

            <div className="text-4xl font-black text-[#1cb0f6] relative z-10">
              {result.label}
            </div>

            <p className="text-gray-500 font-bold text-sm">
              {t.rich("starting_section", {
                section: result.section,
                span: (chunks) => (
                  <span className="text-[#042c60]">{chunks}</span>
                ),
              })}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 relative z-10">
            <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {t("shortcut_enabled")}
            </span>
            <span className="bg-green-100 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {t("bonus_xp", { bonus: result.bonus })}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-bold text-gray-400 animate-pulse pt-2">
          {t("ready_for_next")}
        </p>
      </motion.div>
    </div>
  );
};
