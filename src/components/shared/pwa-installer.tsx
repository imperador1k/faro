"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("[PWA] User accepted install");
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-[9999] mx-auto max-w-sm rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Instala a Faro no teu dispositivo
        </p>
        <p className="mb-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
          Acede mais rapido e aprende mesmo offline.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 rounded-xl bg-[#58cc02] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[#46a302]"
          >
            Instalar
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Agora nao
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
