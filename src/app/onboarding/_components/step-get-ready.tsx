"use client";

import { motion } from "framer-motion";
import { DuoAnimationLottie } from "@/components/ui/lottie-animation";
import { useTranslations } from "next-intl";

export const StepGetReady = () => {
  const t = useTranslations("Onboarding");

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center py-6 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.2, 0.05], scale: [1, 1.2, 1] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
            className="absolute rounded-full bg-sky-400/10"
            style={{
              width: 120 + i * 30,
              height: 120 + i * 30,
              right: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              filter: "blur(50px)",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full max-w-5xl z-10 px-4">
        {/* Mascot Column */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 shrink-0"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full"
          >
            <DuoAnimationLottie className="w-full h-full drop-shadow-[0_20px_40px_rgba(56,189,248,0.3)]" />
          </motion.div>
        </motion.div>

        {/* Content Column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#042c60] leading-tight">
              {t("get_ready_title_part1")} <br />
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sky-400 inline-block mt-2"
              >
                {t("get_ready_title_boost_word")}
              </motion.span>{" "}
              <br />
              {t("get_ready_title_part2")}
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-sm relative"
            >
              <p className="text-lg sm:text-xl font-bold text-gray-500 leading-relaxed italic">
                {t("get_ready_quote")}
              </p>
              {/* Decorative accent */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-sky-100 rounded-full blur-sm" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
