"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, X } from "lucide-react";
import { useState } from "react";

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  const show = !isOnline && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-center gap-3 bg-amber-50 dark:bg-amber-950 border-b-2 border-amber-400 dark:border-amber-700 px-4 py-2.5 shadow-lg"
        >
          <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-sm font-bold text-amber-800 dark:text-amber-200">
            Estás offline — algumas funcionalidades podem não funcionar
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="ml-auto p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
            aria-label="Fechar aviso offline"
          >
            <X className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
