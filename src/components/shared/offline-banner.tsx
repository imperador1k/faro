"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 shadow-lg dark:border-amber-800 dark:bg-amber-950">
            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Offline
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
