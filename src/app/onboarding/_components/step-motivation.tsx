"use client";

import { useOnboardingStore } from "@/store/use-onboarding-store";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Plane, 
  GraduationCap, 
  Brain, 
  Users, 
  Music, 
  MoreHorizontal,
  Check
} from "lucide-react";
import Image from "next/image";

const MOTIVATIONS = [
  { 
    id: "career", 
    title: "Carreira", 
    description: "Impulsionar o meu currículo", 
    icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-blue-100", 
    accent: "text-blue-600" 
  },
  { 
    id: "travel", 
    title: "Viagens", 
    description: "Preparar-me para aventuras", 
    icon: <Plane className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-orange-100", 
    accent: "text-orange-600" 
  },
  { 
    id: "school", 
    title: "Educação", 
    description: "Apoio escolar ou académico", 
    icon: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-green-100", 
    accent: "text-green-600" 
  },
  { 
    id: "brain", 
    title: "Mente Afiada", 
    description: "Exercitar o cérebro", 
    icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-purple-100", 
    accent: "text-purple-600" 
  },
  { 
    id: "family", 
    title: "Família e Amigos", 
    description: "Conectar-me com pessoas", 
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-pink-100", 
    accent: "text-pink-600" 
  },
  { 
    id: "culture", 
    title: "Cultura", 
    description: "Música, filmes e lazer", 
    icon: <Music className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-yellow-100", 
    accent: "text-yellow-600" 
  },
  { 
    id: "other", 
    title: "Outro", 
    description: "Um objetivo diferente", 
    icon: <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8" />, 
    color: "bg-gray-100", 
    accent: "text-gray-600" 
  },
] as const;

export const StepMotivation = () => {
  const { motivation, setMotivation } = useOnboardingStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 pb-10">
      {/* Mascot Conversation Bubble */}
      <div className="flex items-center gap-6 w-full max-w-lg mb-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-24 h-24 shrink-0"
        >
          <Image src="/marco.png" alt="Marco" fill className="object-contain" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm"
        >
          <p className="text-lg font-black text-[#4b4b4b] leading-tight">
            Boa escolha! Agora diz-me, o que te trouxe até aqui? 🧐
          </p>
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l-2 border-b-2 border-gray-200 rotate-45 rounded-bl-lg" />
        </motion.div>
      </div>

      <div className="text-center md:text-left w-full space-y-2 px-2">
        <h1 className="text-3xl font-black text-[#042c60] tracking-tight">
          Qual é o teu <span className="text-sky-500 underline decoration-sky-100">objetivo</span>?
        </h1>
        <p className="text-gray-500 font-bold text-lg">
          Personaliza a tua jornada escolhendo a tua motivação.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-2"
      >
        {MOTIVATIONS.map((itemObj) => {
          const isSelected = motivation === itemObj.id;

          return (
            <motion.button
              key={itemObj.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMotivation(itemObj.id)}
              className={`
                group relative flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left
                ${isSelected 
                  ? "border-[#58cc02] bg-[#f7fff0] shadow-[0_6px_0_#46a302] translate-y-[-2px]" 
                  : "border-gray-200 bg-white shadow-[0_6px_0_#e5e5e5] hover:bg-gray-50 active:shadow-none active:translate-y-[4px]"}
              `}
            >
              <div 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6 ${itemObj.color} ${itemObj.accent}`}
              >
                {itemObj.icon}
              </div>

              <div className="flex flex-col flex-1">
                <span className={`font-black text-lg sm:text-xl leading-none mb-1 ${isSelected ? "text-[#58cc02]" : "text-[#042c60]"}`}>
                  {itemObj.title}
                </span>
                <span className="text-sm font-bold text-gray-400 line-clamp-1">
                  {itemObj.description}
                </span>
              </div>
              
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-[#58cc02] p-1 rounded-full text-white shadow-lg"
                >
                  <Check size={20} strokeWidth={4} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <p className="text-gray-400 font-bold text-sm italic pt-4">
        * Vamos ajustar as lições com base na tua escolha.
      </p>
    </div>
  );
};
