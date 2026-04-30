"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

/**
 * NativeBridge — Handles Android-specific behaviors:
 * 1. Deep Links: Intercepts custom scheme URLs (myduolingo://) from OAuth bounce
 * 2. Back Button: Maps hardware back button to browser history
 * 3. Link Interception: Forces Clerk/Google auth links into Chrome Custom Tabs
 */
export function NativeBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupDeepLinks = async () => {
        await App.addListener('appUrlOpen', async (data) => {
            console.log("[NativeBridge] App opened with URL:", data.url);
            
            // Close the Chrome Custom Tab if it's still open
            Browser.close().catch(() => {});
            
            // Handle our custom scheme from OAuth bounce (sso-callback or native-callback)
            if (data.url.startsWith('myduolingo://')) {
                const fakeUrl = new URL(data.url.replace('myduolingo://', 'https://placeholder.com/'));
                const path = '/' + fakeUrl.pathname.replace(/^\/+/, '');
                const searchParams = fakeUrl.search;
                
                console.log(`[NativeBridge] OAuth bounce received, navigating to: ${path}${searchParams}`);
                router.push(`${path}${searchParams}`);
                return;
            }

            // Standard App Links (https://myduolingo.vercel.app/*)
            try {
                const url = new URL(data.url);
                const path = url.pathname + url.search;
                router.push(path);
            } catch {
                console.error("[NativeBridge] Failed to parse URL:", data.url);
            }
        });
    };

    const setupBackButton = async () => {
      await App.addListener('backButton', () => {
        if (pathname !== '/learn' && pathname !== '/' && pathname !== '/welcome') {
          window.history.back();
        } else {
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
