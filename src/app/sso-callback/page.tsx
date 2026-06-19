"use client";
import { useEffect, useState } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";
import { LottieAnimation } from "@/components/ui/lottie-animation";

/**
 * SSO Callback Page
 *
 * In a desktop (Tauri) flow, this page runs in Chrome, processes the OAuth,
 * and then redirects to /mobile-auth-complete?desktop=true which handles the deep link.
 */
export default function SSOCallbackPage() {
  const [mounted, setMounted] = useState(false);
  const [isDesktopBounce, setIsDesktopBounce] = useState(false);

  useEffect(() => {
    const search = window.location.search;
    setIsDesktopBounce(search.includes("desktop=true"));
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white flex-col gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        <p className="text-slate-500 font-bold">A carregar...</p>
      </div>
    );
  }

  // If this was initiated from Tauri, we must go to mobile-auth-complete to get the ticket.
  // Otherwise, it's a normal web or mobile login, so we go to /learn.
  const targetUrl = isDesktopBounce
    ? "/mobile-auth-complete?desktop=true"
    : "/learn";

  return (
    <div className="flex h-full w-full min-h-screen flex-col items-center justify-center bg-white z-50 fixed inset-0">
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl={targetUrl}
        signUpForceRedirectUrl={targetUrl}
        transferable={true}
      />

      <div className="relative flex flex-col items-center justify-center w-full max-w-md p-8 text-center animate-in fade-in duration-500">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-sky-400 opacity-20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <LottieAnimation className="w-48 h-48 lg:w-64 lg:h-64 relative z-10" />
        </div>

        <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">
          A Autenticar...
        </h1>

        <div className="w-16 h-1.5 bg-slate-200 rounded-full my-4 overflow-hidden">
          <div className="h-full bg-[#58CC02] rounded-full w-full origin-left animate-[progress_1s_ease-in-out_infinite]"></div>
        </div>

        <p className="text-slate-500 font-bold max-w-xs mx-auto">
          A garantir a segurança da tua conta.
        </p>

        <style jsx>{`
          @keyframes progress {
            0% {
              transform: scaleX(0);
            }
            50% {
              transform: scaleX(1);
            }
            100% {
              transform: scaleX(0);
              transform-origin: right;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
