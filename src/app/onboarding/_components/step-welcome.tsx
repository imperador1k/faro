"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Star, Heart, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

export const StepWelcome = () => {
  const t = useTranslations("Onboarding");

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center py-6">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.15, 0.05], y: [0, -40, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
            className="absolute rounded-full bg-[#58cc02]/20"
            style={{
              width: 100 + i * 20,
              height: 100 + i * 20,
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-5xl z-10 px-4">
        {/* Mascot Column */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 shrink-0"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            <Image
              src="/marco.png"
              alt="Marco Mascot"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(88,204,2,0.3)]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Content Column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Speech Bubble */}
            <div className="bg-white dark:bg-slate-900 border-4 border-[#e5e5e5] dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-[0_10px_0_#e5e5e5] dark:shadow-[0_10px_0_#1e293b] relative">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Sparkles className="text-yellow-400 w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {t("new_friend_badge")}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#042c60] dark:text-white leading-none">
                  {t.rich("marco_intro_welcome", {
                    brTag: () => <br />,
                    spanTag: (chunks: React.ReactNode) => (
                      <span className="text-[#58cc02] inline-block mt-2">
                        {chunks}
                      </span>
                    ),
                  })}
                </h1>
              </div>

              {/* Bubble Tail (Responsive) */}
              <div className="absolute -top-3 md:top-1/2 left-1/2 md:left-[-12px] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-white dark:bg-slate-900 border-l-4 border-t-4 md:border-t-0 md:border-b-4 border-[#e5e5e5] dark:border-slate-800 rotate-45 md:-rotate-45" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 md:pl-4"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-500 leading-snug">
              {t.rich("marco_help_description", {
                spanTag: (chunks: React.ReactNode) => (
                  <span className="text-sky-500 font-black">{chunks}</span>
                ),
              })}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 text-[#58cc02]">
              <Heart size={18} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">
                {t("ready_to_start")}
              </span>
              <Heart size={18} fill="currentColor" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
