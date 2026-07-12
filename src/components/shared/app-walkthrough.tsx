"use client";

import { useState, useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslations } from "next-intl";
import { useUISounds } from "@/hooks/use-ui-sounds";
import { haptics } from "@/lib/haptics";
import confetti from "canvas-confetti";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { useUser } from "@clerk/nextjs";
import { setupUserProfile } from "@/actions/profile";

// Helper to render our World-Class UI inside the popover description
const renderGamifiedStep = (
  title: string,
  desc: string,
  iconHtml: string,
  currentStep: number,
  totalSteps: number,
) => {
  const progressPercent = (currentStep / totalSteps) * 100;
  return `
    <div class="gamified-step-container">
      <div class="gamified-progress-bg">
        <div class="gamified-progress-fill" style="width: ${progressPercent}%;">
          <div class="gamified-progress-highlight"></div>
        </div>
      </div>
      
      <div class="gamified-step-content">
        <div class="gamified-step-icon">
          ${iconHtml}
        </div>
        <div class="gamified-step-text">
          <h3 class="gamified-step-title">${title}</h3>
          <p class="gamified-step-desc">${desc}</p>
        </div>
      </div>
    </div>
  `;
};

// Bulletproof helper to find the element based on active Tailwind breakpoint dynamically!
const getTargetSelector = (desktopId: string, mobileId: string): string => {
  const isMobileView =
    typeof window !== "undefined" && window.innerWidth < 1024;
  return `#${isMobileView ? mobileId : desktopId}`;
};

export const AppWalkthrough = () => {
  const t = useTranslations("Walkthrough");
  const { playClick, playWhoosh, playReward } = useUISounds();
  const hasSeenWalkthrough = usePreferencesStore(
    (state) => state.hasSeenWalkthrough,
  );
  const setPreference = usePreferencesStore((state) => state.setPreference);
  const { user, isLoaded } = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !isLoaded) return;
    if (hasSeenWalkthrough) return;

    // Pre-fill name from Clerk if available (Google OAuth users already have their name)
    const initialName = user?.firstName ?? "";

    const timer = setTimeout(() => {
      // Mutable refs shared across steps via closure
      let profileName = initialName;
      let profileFile: File | null = null;
      let profilePreviewUrl: string | null = null;

      // Total steps: 2 profile + 8 tour = 10
      const total = 10;

      const driverObj = driver({
        showProgress: false,
        animate: true,
        allowClose: false, // Blocked during profile steps; unlocked after
        popoverClass: "gamified-tour-popover",
        doneBtnText: t("done", { defaultValue: "Let's Go!" }),
        nextBtnText: t("next", { defaultValue: "Próximo" }),
        prevBtnText: t("prev", { defaultValue: "Anterior" }),

        onHighlightStarted: (element, step) => {
          document.body.classList.add("is-tour-active");

          // Dynamically adjust popover position to prevent covering the buttons on mobile!
          const activeIndex = driverObj.getActiveIndex() ?? 0;
          const isMobileView = window.innerWidth < 1024;
          if (isMobileView && activeIndex >= 4 && activeIndex <= 6) {
            const popoverEl = document.querySelector(
              ".driver-popover",
            ) as HTMLElement | null;
            if (popoverEl) popoverEl.style.top = "20px";
          }

          // Allow closing after profile steps are done (step index >= 2)
          const currentIndex = driverObj.getActiveIndex() ?? 0;
          driverObj.setConfig({ allowClose: currentIndex >= 2 });
        },

        onDestroyStarted: () => {
          document.body.classList.remove("is-tour-active");

          // Close the menu if it was opened during the tutorial
          if ((window as unknown as Record<string, () => void>).closeMobileNav)
            (window as unknown as Record<string, () => void>).closeMobileNav();
          if ((window as unknown as Record<string, () => void>).closeDesktopNav)
            (window as unknown as Record<string, () => void>).closeDesktopNav();

          setPreference("hasSeenWalkthrough", true);
          driverObj.destroy();
        },

        steps: [
          // ── Step 1: Profile Name ───────────────────────────────────
          {
            popover: {
              description: `
                <div class="gamified-step-container">
                  <div class="gamified-progress-bg">
                    <div class="gamified-progress-fill" style="width: 10%;">
                      <div class="gamified-progress-highlight"></div>
                    </div>
                  </div>
                  <div class="gamified-step-content">
                    <div class="gamified-step-icon">
                      <img src="/mascot.svg" style="width:70px; height:70px; animation: bounce 1.5s infinite;" />
                    </div>
                    <div class="gamified-step-text">
                      <h3 class="gamified-step-title">👋 Olá! Como te chamas?</h3>
                      <p class="gamified-step-desc">O teu nome vai aparecer no teu perfil e nas ligas. Escolhe um bom!</p>
                    </div>
                  </div>
                  <div class="profile-setup-input-wrapper" style="margin-top:16px;">
                    <input
                      id="tour-name-input"
                      type="text"
                      placeholder="O teu nome..."
                      maxlength="50"
                      value="${initialName}"
                      style="
                        width: 100%;
                        padding: 10px 14px;
                        border: 2px solid #e5e7eb;
                        border-radius: 12px;
                        font-size: 15px;
                        font-weight: 600;
                        outline: none;
                        transition: border-color 0.2s;
                        box-sizing: border-box;
                      "
                    />
                    <p id="tour-name-error" style="color: #ef4444; font-size: 12px; margin-top: 6px; display: none;">
                      O nome deve ter pelo menos 2 caracteres.
                    </p>
                  </div>
                </div>
              `,
              side: "bottom",
              align: "center",
              onPopoverRender: () => {
                const input = document.getElementById(
                  "tour-name-input",
                ) as HTMLInputElement | null;
                if (input) {
                  input.focus();
                  input.addEventListener("input", () => {
                    profileName = input.value;
                    // Live border feedback
                    input.style.borderColor =
                      input.value.trim().length >= 2 ? "#58cc02" : "#e5e7eb";
                    const errEl = document.getElementById("tour-name-error");
                    if (errEl) errEl.style.display = "none";
                  });
                }
              },
              onNextClick: () => {
                const input = document.getElementById(
                  "tour-name-input",
                ) as HTMLInputElement | null;
                const name = input?.value?.trim() ?? profileName.trim();
                if (name.length < 2) {
                  const errEl = document.getElementById("tour-name-error");
                  if (errEl) errEl.style.display = "block";
                  if (input) input.style.borderColor = "#ef4444";
                  return; // Block advancement
                }
                profileName = name;
                playClick();
                driverObj.moveNext();
              },
            },
          },

          // ── Step 2: Profile Avatar ─────────────────────────────────
          {
            popover: {
              description: `
                <div class="gamified-step-container">
                  <div class="gamified-progress-bg">
                    <div class="gamified-progress-fill" style="width: 20%;">
                      <div class="gamified-progress-highlight"></div>
                    </div>
                  </div>
                  <div class="gamified-step-content">
                    <div class="gamified-step-icon">
                      <div style="font-size: 3rem;">📸</div>
                    </div>
                    <div class="gamified-step-text">
                      <h3 class="gamified-step-title">A tua foto de perfil</h3>
                      <p class="gamified-step-desc">Coloca uma foto para os outros te reconhecerem. Podes saltar se quiseres!</p>
                    </div>
                  </div>
                  <div style="margin-top:16px; display:flex; flex-direction:column; align-items:center; gap:12px;">
                    <div id="tour-avatar-preview" style="
                      width: 80px; height: 80px;
                      border-radius: 50%;
                      border: 3px dashed #d1d5db;
                      display: flex; align-items: center; justify-content: center;
                      font-size: 2rem;
                      background: #f9fafb;
                      overflow: hidden;
                      cursor: pointer;
                    ">
                      👤
                    </div>
                    <input id="tour-avatar-input" type="file" accept="image/*" style="display:none;" />
                    <button id="tour-avatar-btn" style="
                      background: #58cc02; color: white; border: none;
                      padding: 8px 20px; border-radius: 10px;
                      font-size: 13px; font-weight: 700; cursor: pointer;
                    ">Escolher Foto</button>
                    <p id="tour-avatar-filename" style="font-size: 12px; color: #6b7280;"></p>
                  </div>
                </div>
              `,
              side: "bottom",
              align: "center",
              onPopoverRender: () => {
                const input = document.getElementById(
                  "tour-avatar-input",
                ) as HTMLInputElement | null;
                const btn = document.getElementById("tour-avatar-btn");
                const preview = document.getElementById("tour-avatar-preview");
                const filename = document.getElementById(
                  "tour-avatar-filename",
                );

                if (btn && input) {
                  btn.addEventListener("click", () => input.click());
                }
                if (preview && input) {
                  preview.addEventListener("click", () => input.click());
                }
                if (input) {
                  input.addEventListener("change", () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    profileFile = file;
                    const url = URL.createObjectURL(file);
                    profilePreviewUrl = url;
                    if (preview) {
                      preview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;" />`;
                      preview.style.border = "3px solid #58cc02";
                    }
                    if (filename) filename.textContent = file.name;
                  });
                }
              },
              onNextClick: () => {
                // Save profile to DB (fire and forget — non-blocking for the user)
                setupUserProfile({ userName: profileName }).catch(
                  console.error,
                );

                // Update Clerk profile (name + optional image)
                if (user) {
                  const updates: Promise<unknown>[] = [
                    user.update({ firstName: profileName }),
                  ];
                  if (profileFile) {
                    updates.push(user.setProfileImage({ file: profileFile }));
                  }
                  Promise.all(updates).catch(console.error);
                }

                setPreference("hasSetupProfile", true);
                playClick();
                driverObj.moveNext();
              },
              onPrevClick: () => {
                playClick();
                driverObj.movePrevious();
              },
            },
          },

          // ── Step 3: Welcome ────────────────────────────────────────
          {
            popover: {
              description: renderGamifiedStep(
                t("welcome_title", { defaultValue: "Boas-vindas!" }),
                t("welcome_desc", {
                  defaultValue: "Prepara-te para a viagem!",
                }),
                `<img src="/mascot.svg" style="width:70px; height:70px; animation: bounce 1.5s infinite;" />`,
                3,
                total,
              ),
              side: "bottom",
              align: "center",
            },
          },
          // ── Step 4: Learn ─────────────────────────────────────────
          {
            element: getTargetSelector("tour-learn", "tour-learn-mobile"),
            popover: {
              description: renderGamifiedStep(
                t("learn_title", { defaultValue: "O Teu Mapa" }),
                t("learn_desc", { defaultValue: "Ganha XP!" }),
                `<div style="font-size: 3rem;">📚</div>`,
                4,
                total,
              ),
              side: "right",
              align: "start",
            },
          },
          // ── Step 5: Practice ──────────────────────────────────────
          {
            element: getTargetSelector("tour-practice", "tour-practice-mobile"),
            popover: {
              description: renderGamifiedStep(
                t("practice_title", { defaultValue: "Prática com IA" }),
                t("practice_desc", { defaultValue: "Falar com robôs!" }),
                `<div style="font-size: 3rem;">🤖</div>`,
                5,
                total,
              ),
              side: "right",
              align: "start",
            },
          },
          // ── Step 6: More ──────────────────────────────────────────
          {
            element: getTargetSelector("tour-more-desktop", "tour-more-mobile"),
            popover: {
              description: renderGamifiedStep(
                `🤫 O Menu Secreto`,
                `Clica em "Próximo" para eu te revelar os tesouros escondidos!`,
                `<div style="font-size: 3rem;">🗝️</div>`,
                6,
                total,
              ),
              side: "right",
              align: "start",
            },
          },
          // ── Step 7: Leaderboard ───────────────────────────────────
          {
            element: getTargetSelector(
              "tour-leaderboard",
              "tour-leaderboard-mobile",
            ),
            popover: {
              description: renderGamifiedStep(
                t("leaderboard_title", {
                  defaultValue: "Ligas Competitivas",
                }),
                t("leaderboard_desc", {
                  defaultValue: "Consegues chegar ao Top 3?",
                }),
                `<div style="font-size: 3rem;">🏆</div>`,
                7,
                total,
              ),
              side: "top",
              align: "center",
            },
          },
          // ── Step 8: Quests ────────────────────────────────────────
          {
            element: getTargetSelector("tour-quests", "tour-quests-mobile"),
            popover: {
              description: renderGamifiedStep(
                t("quests_title", { defaultValue: "Missões Diárias" }),
                t("quests_desc", { defaultValue: "Novos desafios!" }),
                `<div style="font-size: 3rem;">🎯</div>`,
                8,
                total,
              ),
              side: "top",
              align: "center",
            },
          },
          // ── Step 9: Shop ──────────────────────────────────────────
          {
            element: getTargetSelector("tour-shop", "tour-shop-mobile"),
            popover: {
              description: renderGamifiedStep(
                t("shop_title", { defaultValue: "A Loja" }),
                t("shop_desc", { defaultValue: "Usa moedas suadas." }),
                `<div style="font-size: 3rem;">🛍️</div>`,
                9,
                total,
              ),
              side: "top",
              align: "center",
            },
          },
          // ── Step 10: Ready ────────────────────────────────────────
          {
            popover: {
              description: renderGamifiedStep(
                t("ready_title", { defaultValue: "Tudo Pronto!" }),
                t("ready_desc", { defaultValue: "Agora é contigo!" }),
                `<div style="font-size: 3rem;">✨</div>`,
                10,
                total,
              ),
              side: "bottom",
              align: "center",
              onPopoverRender: () => {
                playReward();
                haptics.success();
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ["#FFC800", "#58CC02", "#1CB0F6"],
                  zIndex: 1000000,
                });
              },
            },
          },
        ],
      });

      playWhoosh();
      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    t,
    playClick,
    playWhoosh,
    playReward,
    hasSeenWalkthrough,
    setPreference,
    mounted,
    isLoaded,
    user,
  ]);

  return null;
};
