"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export function NativeBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Handle Deep Links (App Links)
    const setupDeepLinks = async () => {
      await App.addListener('appUrlOpen', (data) => {
        // data.url will be something like https://myduolingo.vercel.app/auth-success
        const url = new URL(data.url);
        const path = url.pathname + url.search;
        
        // Navigate inside our Next.js app
        router.push(path);
      });
    };

    const setupBackButton = async () => {
      // In Capacitor, we can listen to the native back button
      await App.addListener('backButton', (data) => {
        // Logic: If we are not on a main entry page, go back in history
        if (pathname !== '/learn' && pathname !== '/' && pathname !== '/welcome') {
          window.history.back();
        } else {
          // Otherwise, exit the app
          App.exitApp();
        }
      });
    };

    setupDeepLinks();
    setupBackButton();

    return () => {
      App.removeAllListeners();
    };
  }, [pathname, router]);

  return null;
}
