"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { onSelectCourse } from "@/actions/user-progress";
import { useRouter } from "next/navigation";

export const OnboardingSync = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { 
    selectedCourse, 
    motivation, 
    experienceLevel, 
    placementResults,
    isOnboardingComplete,
    completeOnboarding 
  } = useOnboardingStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncData = async () => {
      // Only sync if user is logged in, onboarding was completed locally, 
      // and we have a course selected
      if (isUserLoaded && user && selectedCourse && isOnboardingComplete && !isSyncing) {
        setIsSyncing(true);
        try {
          console.log("Sincronizando dados de onboarding para o utilizador:", user.id);
          
          await onSelectCourse(selectedCourse, motivation, experienceLevel, placementResults?.level);
          
          // Clear onboarding status so we don't sync again
          // We keep the data for now but mark it as handled
          // Actually, let's just reset the whole store if we want to be clean
          // but for now, just marking it as not complete is enough to stop the sync
          localStorage.removeItem("onboarding-storage");
          document.cookie = "onboarding_completed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          
          // Redirect to learn to show the new course
          router.refresh();
        } catch (error) {
          console.error("Erro ao sincronizar onboarding:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncData();
  }, [isUserLoaded, user, selectedCourse, isOnboardingComplete, motivation, experienceLevel, isSyncing, router]);

  return null; // Invisible component
};
