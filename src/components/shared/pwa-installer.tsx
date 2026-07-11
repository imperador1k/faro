"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, Download, X } from "lucide-react";
import { detectPlatform, isRunningAsPWA } from "@/lib/platform";
import { APP_DOWNLOADS, PWA_INSTALLER } from "@/lib/constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const platformIcons: Record<string, React.ElementType> = {
  windows: Monitor,
  macos: Monitor,
  linux: Monitor,
  android: Smartphone,
  ios: Smartphone,
};

export const PwaInstaller = () => {
  const t = useTranslations("pwa");
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [promptMode, setPromptMode] = useState<"native" | "pwa" | null>(null);

  const isAppAlreadyInstalled = isRunningAsPWA();

  const getEngagement = (): number => {
    try {
      return Number(localStorage.getItem(PWA_INSTALLER.storageKeys.engagement)) || 0;
    } catch {
      return 0;
    }
  };

  const incrementEngagement = useCallback(() => {
    try {
      const count = getEngagement() + 1;
      localStorage.setItem(PWA_INSTALLER.storageKeys.engagement, String(count));
    } catch {}
  }, []);

  const getIsDismissedRecently = (): boolean => {
    try {
      const ts = localStorage.getItem(PWA_INSTALLER.storageKeys.dismissed);
      if (!ts) return false;
      const elapsed = Date.now() - Number(ts);
      return elapsed < PWA_INSTALLER.dismissCooldownDays * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  const getIsInstalled = (): boolean => {
    try {
      return localStorage.getItem(PWA_INSTALLER.storageKeys.installed) === "true";
    } catch {
      return false;
    }
  };

  const markInstalled = () => {
    try {
      localStorage.setItem(PWA_INSTALLER.storageKeys.installed, "true");
    } catch {}
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(PWA_INSTALLER.storageKeys.dismissed, String(Date.now()));
    } catch {}
    setVisible(false);
  };

  // Platform detection
  useEffect(() => {
    if (isAppAlreadyInstalled || getIsInstalled()) return;

    const platform = detectPlatform();

    // Tauri and Capacitor have their own native installers/updaters
    if (platform === "tauri" || platform === "capacitor") return;

    const downloadUrl = APP_DOWNLOADS[platform];
    if (downloadUrl) {
      setPromptMode("native");
    } else if ("onbeforeinstallprompt" in window || platform === "pwa") {
      setPromptMode("pwa");
    } else {
      // Unsupported or irrelevant platform
      return;
    }

    incrementEngagement();
    if (getIsDismissedRecently()) return;
    if (getEngagement() < PWA_INSTALLER.engagementThreshold) return;

    setVisible(true);
  }, [isAppAlreadyInstalled, incrementEngagement]);

  // Listen for beforeinstallprompt (PWA mode only)
  useEffect(() => {
    if (promptMode !== "pwa") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [promptMode]);

  // Detect install for PWA mode
  useEffect(() => {
    const handler = () => {
      markInstalled();
      setVisible(false);
    };
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      markInstalled();
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDownloadNative = () => {
    const platform = detectPlatform();
    const url = APP_DOWNLOADS[platform];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    markInstalled();
    setVisible(false);
  };

  if (!visible || !promptMode) return null;

  const Icon = promptMode === "native" ? (platformIcons[detectPlatform()] ?? Download) : Download;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-[9999] mx-auto max-w-sm rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#58cc02]/10">
            <Icon className="h-5 w-5 text-[#58cc02]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t("title")}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={t("dismiss")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          {promptMode === "pwa" ? (
            <button
              onClick={handleInstallPwa}
              className="flex-1 rounded-xl bg-[#58cc02] px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#46a302]"
            >
              {t("install_button")}
            </button>
          ) : (
            <button
              onClick={handleDownloadNative}
              className="flex-1 rounded-xl bg-[#58cc02] px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#46a302]"
            >
              {t("download_button")}
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {t("later")}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
