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
 *
 * WHY no navigation interceptor needed:
 * Capacitor's built-in WebViewClient.shouldOverrideUrlLoading() handles this.
 * Any URL NOT in `allowNavigation` (like clerk.accounts.dev or accounts.google.com)
 * is automatically opened in Chrome. We removed Clerk from allowNavigation so
 * OAuth redirects naturally open in Chrome without any JS monkey-patching.
 */
export function NativeBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // ── Deep Link Handler ────────────────────────────────────────────
    const setupDeepLinks = async () => {
        await App.addListener('appUrlOpen', async (data) => {
            console.log("[NativeBridge] App opened with URL:", data.url);
            
            // Close the Chrome Custom Tab if it's still open
            Browser.close().catch(() => {});
            
            // Handle our custom scheme from OAuth bounce
            if (data.url.startsWith('myduolingo://')) {
                const fakeUrl = new URL(data.url.replace('myduolingo://', 'https://placeholder.com/'));
                const path = '/' + fakeUrl.pathname.replace(/^\/+/, '');
                const searchParams = fakeUrl.search;
                
                console.log(`[NativeBridge] OAuth bounce → ${path}${searchParams}`);
                router.push(`${path}${searchParams}`);
                return;
            }

            // Standard App Links (https://myduolingo.vercel.app/*)
            try {
                const url = new URL(data.url);
                router.push(url.pathname + url.search);
            } catch {
                console.error("[NativeBridge] Failed to parse URL:", data.url);
            }
        });
    };

    // ── Back Button Handler ──────────────────────────────────────────
    const setupBackButton = async () => {
      await App.addListener('backButton', () => {
        if (pathname !== '/learn' && pathname !== '/' && pathname !== '/welcome') {
          window.history.back();
        } else {
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
