"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

export function NativeBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const clerk = useClerk();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Handle Deep Links (App Links)
    const setupDeepLinks = async () => {
        await App.addListener('appUrlOpen', async (data) => {
            console.log("App abriu com URL:", data.url);
            
            // Fechamos a Custom Tab se ainda estiver aberta
            Browser.close().catch(() => {});
            
            // Se o Chrome redirecionar para a app usando o nosso custom scheme
            if (data.url.includes('myduolingo://native-callback')) {
                console.log("Recebido callback nativo do OAuth!");
                const url = new URL(data.url.replace('myduolingo://', 'https://'));
                const searchParams = url.search;
                
                // Dizemos ao router interno do Next.js para abrir o nosso processador SSO
                router.push(`/sso-callback${searchParams}`);
                return;
            }

            // Fallback: se não for o nosso custom scheme específico
            const url = new URL(data.url);
            const path = url.pathname + url.search;
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
