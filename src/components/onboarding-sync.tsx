"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { onSelectCourse } from "@/actions/user-progress";
import { useRouter } from "next/navigation";

interface OnboardingSyncProps {
  isFullScreen?: boolean;
}

export const OnboardingSync = ({
  isFullScreen: _isFullScreen,
}: OnboardingSyncProps) => {
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
      if (isSyncing || !isUserLoaded || !user) return;

      if (sessionStorage.getItem("onboarding_synced") === user.id) {
        return;
      }

      let dataToSync: {
        courseId: number;
        motivation: string | null;
        experienceLevel: string | null;
        cefrLevel: string | null;
      } | null = null;

      if (selectedCourse && isOnboardingComplete) {
        dataToSync = {
          courseId: selectedCourse,
          motivation,
          experienceLevel,
          cefrLevel: placementResults?.level || null,
        };
      } else {
        const cookies = document.cookie.split("; ");
        const onboardingCookie = cookies.find((row) =>
          row.startsWith("onboarding_data="),
        );
        if (onboardingCookie) {
          try {
            const parsed = JSON.parse(
              decodeURIComponent(onboardingCookie.split("=")[1]),
            );
            if (parsed.selectedCourse) parsed.courseId = parsed.selectedCourse;
            dataToSync = parsed;
          } catch (e) {
            console.error("Erro ao ler cookie de onboarding:", e);
          }
        }
      }

      if (dataToSync) {
        setIsSyncing(true);
        try {
          if (process.env.NODE_ENV !== "production")
            console.log(`[Sync] A iniciar sincronização para ${user.id}...`);

          await onSelectCourse(
            dataToSync.courseId,
            dataToSync.motivation,
            dataToSync.experienceLevel,
            dataToSync.cefrLevel,
          );

          // Reset walkthrough flag so the new-user tour fires
          usePreferencesStore
            .getState()
            .setPreference("hasSeenWalkthrough", false);

          reset();
          localStorage.removeItem("onboarding-storage");

          const cookieOptions =
            "path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          document.cookie = `onboarding_data=; ${cookieOptions}`;
          document.cookie = `onboarding_completed=; ${cookieOptions}`;

          sessionStorage.setItem("onboarding_synced", user.id);
          if (process.env.NODE_ENV !== "production")
            console.log("[Sync] Sucesso. A refrescar página...");
          router.refresh();
        } catch (error) {
          console.error("[Sync] Erro crítico:", error);
          setIsSyncing(false);
        }
      }
    };

    syncData();
  }, [
    isUserLoaded,
    user,
    selectedCourse,
    isOnboardingComplete,
    motivation,
    experienceLevel,
    placementResults,
    isSyncing,
    router,
    reset,
  ]);

  return null;
};
