"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/register-sw";
import { PwaInstaller } from "./pwa-installer";

export const PwaWrapper = () => {
  useEffect(() => {
    registerSW();
  }, []);

  return <PwaInstaller />;
};
