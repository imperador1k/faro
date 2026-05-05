"use client";

import { useEffect, useState } from "react";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { motion, AnimatePresence } from "framer-motion";
import { generatePlacementTest, type PlacementQuestion } from "@/actions/onboarding";
import Image from "next/image";
import { Check, X, Loader2 } from "lucide-react";

interface StepPlacementProps {
  courseTitle: string;
}

export const StepPlacement = ({ courseTitle }: StepPlacementProps) => {
  const { selectedCourse, setPlacementResults, nextStep } = useOnboardingStore();
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      // Use the dynamic course title for AI generation
      const result = await generatePlacementTest(courseTitle);
      if (result.success && result.questions) {
        setQuestions(result.questions);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [selectedCourse, courseTitle]);

  const handleCheck = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === questions[currentIndex].correctIndex;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Calculate final level based on score
        let level: "A1" | "A2" | "B1" = "A1";
        const finalScore = correct ? score + 1 : score;
        
        if (finalScore >= 5) level = "B1";
        else if (finalScore >= 3) level = "A2";
        else level = "A1";

        setPlacementResults({ score: finalScore, level });
        nextStep();
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={64} className="text-[#58cc02]" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#042c60]">Gerei um teste para ti!</h2>
          <p className="text-gray-500 font-bold">O Marco está a pensar em boas perguntas...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Erro ao carregar o teste.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto space-y-8">
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center text-sm font-black text-gray-400 uppercase tracking-widest">
          <span>Teste de Nivelamento</span>
          <span>{currentIndex + 1} de {questions.length}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-sky-400"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[#042c60] leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              disabled={isCorrect !== null}
              onClick={() => setSelectedOption(index)}
              className={`p-4 rounded-2xl border-2 border-b-4 font-bold text-lg transition-all text-left
                ${selectedOption === index 
                  ? "border-[#1cb0f6] bg-[#ddf4ff] text-[#1cb0f6]" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
                }
                ${isCorrect !== null && index === currentQuestion.correctIndex ? "border-[#58cc02] bg-[#d7ffb8] text-[#58cc02]" : ""}
                ${isCorrect === false && index === selectedOption ? "border-[#ff4b4b] bg-[#ffdbdb] text-[#ff4b4b]" : ""}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleCheck}
          disabled={selectedOption === null || isCorrect !== null}
          className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all
            ${selectedOption !== null && isCorrect === null
              ? "bg-[#58cc02] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Verificar
        </button>
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 p-6 z-[60] flex flex-col md:flex-row items-center gap-4 border-t-2
              ${isCorrect ? "bg-[#d7ffb8] border-[#58cc02]" : "bg-[#ffdbdb] border-[#ff4b4b]"}
            `}
          >
            <div className={`p-3 rounded-full ${isCorrect ? "bg-white text-[#58cc02]" : "bg-white text-[#ff4b4b]"}`}>
              {isCorrect ? <Check size={32} strokeWidth={4} /> : <X size={32} strokeWidth={4} />}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className={`text-xl font-black ${isCorrect ? "text-[#46a302]" : "text-[#ea2b2b]"}`}>
                {isCorrect ? "Excelente!" : "Ups, quase!"}
              </h3>
              <p className={`font-bold ${isCorrect ? "text-[#58cc02]" : "text-[#ff4b4b]"}`}>
                {currentQuestion.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
