"use client";

import { useOnboardingStore } from "@/store/use-onboarding-store";
import { motion } from "framer-motion";
import { Zap, Trophy, Gem, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const StepSignUp = () => {
  const { placementResults, experienceLevel } = useOnboardingStore();

  // Calculate potential rewards to show
  const hasTestBonus = experienceLevel !== "beginner" && placementResults;
  const xpBonus = hasTestBonus ? 50 : 0;
  const gemBonus = 100;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 py-4 max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-32 h-32 md:w-40 md:h-40"
        >
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <Image
            src="/duo_happy.png"
            alt="Happy Duo"
            fill
            className="object-contain relative z-10"
          />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-[#042c60] leading-tight">
            Tudo pronto para salvar o teu{" "}
            <span className="text-sky-500">progresso</span>!
          </h2>
          <p className="text-lg font-bold text-gray-500 max-w-md mx-auto">
            Cria o teu perfil agora para garantires estas recompensas
            exclusivas:
          </p>
        </div>
      </div>

      {/* Rewards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
      >
        {/* Streak Reward */}
        <motion.div
          variants={item}
          className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
            <Zap size={40} className="text-orange-500" />
          </div>
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Zap className="text-orange-500 fill-orange-500" size={24} />
          </div>
          <span className="font-black text-orange-600 text-lg leading-tight">
            Streak Ativa
          </span>
          <span className="text-xs font-bold text-orange-400 uppercase">
            1º Dia Grátis
          </span>
        </motion.div>

        {/* XP Reward */}
        <motion.div
          variants={item}
          className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
            <Trophy size={40} className="text-blue-500" />
          </div>
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Trophy className="text-blue-500" size={24} />
          </div>
          <span className="font-black text-blue-600 text-lg leading-tight">
            +{xpBonus + 20} XP
          </span>
          <span className="text-xs font-bold text-blue-400 uppercase">
            Bónus Inicial
          </span>
        </motion.div>

        {/* Gems Reward */}
        <motion.div
          variants={item}
          className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
            <Gem size={40} className="text-emerald-500" />
          </div>
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Gem className="text-emerald-500 fill-emerald-500" size={24} />
          </div>
          <span className="font-black text-emerald-600 text-lg leading-tight">
            {gemBonus} Joias
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase">
            Boas-vindas
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="flex items-center gap-2 text-[#58cc02] bg-[#f7fff0] px-4 py-2 rounded-full border border-[#58cc02]/20">
          <CheckCircle2 size={18} />
          <span className="text-sm font-black uppercase tracking-wider">
            Perfil pronto para criar
          </span>
        </div>

        <p className="text-xs font-bold text-gray-400 max-w-xs leading-relaxed">
          Ao clicar em continuar, criarás a tua conta para guardar o progresso e
          as tuas recompensas!
        </p>
      </motion.div>
    </div>
  );
};
