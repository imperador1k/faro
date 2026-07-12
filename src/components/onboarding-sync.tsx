"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { onSelectCourse } from "@/actions/user-progress";
import { useRouter } from "next/navigation";
import { ProfileSetupModal } from "@/components/shared/profile-setup-modal";

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
  const [syncDone, setSyncDone] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const router = useRouter();

  const needsProfileSetup = useCallback(() => {
    if (!user) return false;
    return !user.firstName && !user.username;
  }, [user]);

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
    sessionStorage.setItem("onboarding_synced", user!.id);
    router.refresh();
  };

  useEffect(() => {
    const syncData = async () => {
      if (isSyncing || !isUserLoaded || !user) return;
      
      if (sessionStorage.getItem("onboarding_synced") === user.id) {
        return;
      }

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

      if (dataToSync) {
        setIsSyncing(true);
        try {
          if (process.env.NODE_ENV !== "production") console.log(`[Sync] A iniciar sincronização para ${user.id}...`);
          
          await onSelectCourse(
            dataToSync.courseId, 
            dataToSync.motivation, 
            dataToSync.experienceLevel, 
            dataToSync.cefrLevel
          );
          
          setSyncDone(true);

          // Reset tutorial/notification flags so they fire for this new account
          usePreferencesStore.getState().setPreference("hasSeenWalkthrough", false);

          reset();
          localStorage.removeItem("onboarding-storage");
          
          const cookieOptions = "path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          document.cookie = `onboarding_data=; ${cookieOptions}`;
          document.cookie = `onboarding_completed=; ${cookieOptions}`;

          if (needsProfileSetup()) {
            setShowProfileSetup(true);
            setIsSyncing(false);
          } else {
            sessionStorage.setItem("onboarding_synced", user.id);
            if (process.env.NODE_ENV !== "production") console.log("[Sync] Sucesso. A refrescar página...");
            router.refresh();
          }
        } catch (error) {
          console.error("[Sync] Erro crítico:", error);
          setIsSyncing(false); 
        }
      }
    };

    syncData();
  }, [isUserLoaded, user, selectedCourse, isOnboardingComplete, motivation, experienceLevel, placementResults, isSyncing, router, reset, needsProfileSetup]);

  if (showProfileSetup) {
    return <ProfileSetupModal onComplete={handleProfileComplete} />;
  }

  return null;
};
