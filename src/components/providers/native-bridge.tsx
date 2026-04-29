"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
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
        
        // Close the Custom Tab if it's still open
        Browser.close().catch(() => {});
        
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

    const setupLinkInterception = () => {
      const handleLinkClick = async (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a');
        if (!anchor) return;

        const url = anchor.href;
        
        // If the link is for Clerk or Google Auth, open in Custom Tab
        if (url.includes('clerk') || url.includes('accounts.google.com')) {
          e.preventDefault();
          await Browser.open({ url, windowName: '_blank' });
        }
      };

      document.addEventListener('click', handleLinkClick);
      return () => document.removeEventListener('click', handleLinkClick);
    };

    setupDeepLinks();
    setupBackButton();
    const cleanupInterception = setupLinkInterception();

    return () => {
      App.removeAllListeners();
      cleanupInterception();
    };
  }, [pathname, router]);

  return null;
}
