"use client";

import { useOnboardingStore } from "@/store/use-onboarding-store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { StepWelcome } from "./step-welcome";
import { StepGetReady } from "./step-get-ready";
import { StepCourse } from "./step-course";
import { StepMotivation } from "./step-motivation";
import { StepLevel } from "./step-level";
import { StepPlacement } from "./step-placement";
import { StepPlacementResult } from "./step-placement-result";
import { StepSignUp } from "./step-sign-up";

interface OnboardingClientProps {
  courses: {
    id: number;
    title: string;
    imageSrc: string;
    studentCount: number;
  }[];
}

const TOTAL_STEPS = 8;

const variants = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
} as const;

export const OnboardingClient = ({ courses }: OnboardingClientProps) => {
  const router = useRouter();
  const t = useTranslations("Onboarding");
  const {
    step,
    setStep,
    prevStep,
    nextStep,
    selectedCourse,
    motivation,
    experienceLevel,
    placementResults,
    completeOnboarding,
  } = useOnboardingStore();

  const progress = (step / TOTAL_STEPS) * 100;

  const selectedCourseTitle =
    courses.find((c) => c.id === selectedCourse)?.title ||
    t("default_course_title");

  const handleBack = () => {
    if (step === 1) {
      router.push("/");
      return;
    }

    if (step === 8 && experienceLevel === "beginner") {
      setStep(5);
      return;
    }

    prevStep();
  };

  const canContinue =
    step === 1 ||
    step === 2 ||
    (step === 3 && selectedCourse !== null) ||
    (step === 4 && motivation !== null) ||
    (step === 5 && experienceLevel !== null) ||
    step === 6 ||
    step === 7 ||
    step === 8;

  const handleContinue = () => {
    if (!canContinue) return;

    if (step === 5) {
      if (experienceLevel === "beginner") {
        setStep(8);
        return;
      }
      nextStep();
      return;
    }

    if (step < TOTAL_STEPS) {
      nextStep();
    } else {
      completeOnboarding();

      const onboardingData = {
        selectedCourse,
        motivation,
        experienceLevel,
        cefrLevel: placementResults?.level || null,
      };

      document.cookie = `onboarding_data=${JSON.stringify(onboardingData)}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie =
        "onboarding_completed=true; path=/; max-age=3600; SameSite=Lax";

      window.location.href = "/sign-up";
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-white dark:bg-slate-950 text-[#042c60] dark:text-slate-200 overflow-hidden">
      <header className="flex items-center px-4 pt-4 lg:max-w-5xl lg:mx-auto w-full gap-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </Button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#58cc02]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative lg:max-w-5xl lg:mx-auto w-full px-4 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col items-center justify-center relative overflow-x-hidden py-4 my-auto shrink-0"
          >
            {step === 1 && <StepWelcome />}
            {step === 2 && <StepGetReady />}
            {step === 3 && <StepCourse courses={courses} />}
            {step === 4 && <StepMotivation />}
            {step === 5 && <StepLevel courseTitle={selectedCourseTitle} />}
            {step === 6 && <StepPlacement courseTitle={selectedCourseTitle} />}
            {step === 7 && <StepPlacementResult />}
            {step === 8 && <StepSignUp />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="w-full p-4 bg-white dark:bg-slate-950 border-t-2 border-gray-100 dark:border-slate-800 lg:max-w-5xl lg:mx-auto shrink-0">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant={canContinue ? "default" : "locked"}
          size="lg"
          className={`w-full py-4 rounded-2xl text-lg ${
            !canContinue ? "bg-[#e5e5e5] text-[#afafaf] border-none shadow-none opacity-100" : ""
          }`}
        >
          {t("continue_button")}
        </Button>
      </footer>
    </div>
  );
};
