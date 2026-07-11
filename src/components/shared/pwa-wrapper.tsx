"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/register-sw";
import { retryOfflineQueue } from "@/lib/offline-queue";
import { PwaInstaller } from "./pwa-installer";

export const PwaWrapper = () => {
  useEffect(() => {
    registerSW();

    const handleOnline = () => {
      retryOfflineQueue();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return <PwaInstaller />;
};
