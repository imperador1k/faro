"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { onSelectCourse } from "@/actions/user-progress";
import { useRouter } from "next/navigation";

interface OnboardingSyncProps {
  isFullScreen?: boolean;
}

export const OnboardingSync = ({ isFullScreen }: OnboardingSyncProps) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { 
    selectedCourse, 
    motivation, 
    experienceLevel, 
    placementResults,
    isOnboardingComplete,
    reset,
  } = useOnboardingStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncData = async () => {
      // 1. Safety locks
      if (isSyncing || !isUserLoaded || !user) return;
      
      // Prevent multiple syncs in the same window session
      if (sessionStorage.getItem("onboarding_synced") === user.id) {
        return;
      }

      // 2. Identify data to sync
      let dataToSync = null;

      if (selectedCourse && isOnboardingComplete) {
        dataToSync = {
          courseId: selectedCourse,
          motivation,
          experienceLevel,
          cefrLevel: placementResults?.level || null
        };
      } else {
        const cookies = document.cookie.split("; ");
        const onboardingCookie = cookies.find(row => row.startsWith("onboarding_data="));
        if (onboardingCookie) {
          try {
            dataToSync = JSON.parse(decodeURIComponent(onboardingCookie.split("=")[1]));
            if (dataToSync.selectedCourse) dataToSync.courseId = dataToSync.selectedCourse;
          } catch (e) {
            console.error("Erro ao ler cookie de onboarding:", e);
          }
        }
      }

      // 3. Perform Sync
      if (dataToSync) {
        setIsSyncing(true);
        try {
          console.log(`[Sync] A iniciar sincronização para ${user.id}...`);
          
          await onSelectCourse(
            dataToSync.courseId, 
            dataToSync.motivation, 
            dataToSync.experienceLevel, 
            dataToSync.cefrLevel
          );
          
          // Mark as synced in this session
          sessionStorage.setItem("onboarding_synced", user.id);
          
          // Cleanup
          reset();
          localStorage.removeItem("onboarding-storage");
          
          // Aggressive cookie clearing
          const cookieOptions = "path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          document.cookie = `onboarding_data=; ${cookieOptions}`;
          document.cookie = `onboarding_completed=; ${cookieOptions}`;
          
          console.log("[Sync] Sucesso. A refrescar página...");
          
          router.refresh();
        } catch (error) {
          console.error("[Sync] Erro crítico:", error);
          setIsSyncing(false); 
        }
      }
    };

    syncData();
  }, [isUserLoaded, user, selectedCourse, isOnboardingComplete, motivation, experienceLevel, placementResults, isSyncing, router, reset]);

  return null;
};
