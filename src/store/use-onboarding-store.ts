import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OnboardingState {
  step: number;
  selectedCourse: number | null;
  motivation: string | null;
  experienceLevel: "beginner" | "basic" | "intermediate" | "advanced" | null;
  placementResults: {
    score: number;
    level: "A1" | "A2" | "B1";
  } | null;
  isOnboardingComplete: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCourse: (course: number) => void;
  setMotivation: (motivation: string) => void;
  setExperienceLevel: (level: "beginner" | "basic" | "intermediate" | "advanced") => void;
  setPlacementResults: (results: { score: number; level: "A1" | "A2" | "B1" }) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      selectedCourse: null,
      motivation: null,
      experienceLevel: null,
      placementResults: null,
      isOnboardingComplete: false,
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step > 1 ? state.step - 1 : 1 })),
      setCourse: (course) => set({ selectedCourse: course }),
      setMotivation: (motivation) => set({ motivation }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setPlacementResults: (results) => set({ placementResults: results }),
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      reset: () => set({
        step: 1,
        selectedCourse: null,
        motivation: null,
        experienceLevel: null,
        placementResults: null,
        isOnboardingComplete: false,
      }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
