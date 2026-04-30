"use client";
import { useEffect, useState } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";
import { LottieAnimation } from "@/components/ui/lottie-animation";

/**
 * SSO Callback Page — handles two scenarios:
 *
 * 1. Opened INSIDE the WebView (Capacitor): AuthenticateWithRedirectCallback
 *    processes the Clerk token normally using the shared cookie jar.
 *
 * 2. Opened in Chrome Custom Tab (external browser during OAuth):
 *    We can't process the token here because Chrome's cookies are separate.
 *    Instead, we bounce back to the app via the custom deep link scheme,
 *    carrying the query params. The NativeBridge will catch the deep link
 *    and navigate back to this page INSIDE the WebView.
 */
export default function SSOCallbackPage() {
    const [isNativeBrowser, setIsNativeBrowser] = useState(false);

    useEffect(() => {
        // If we're inside the Capacitor WebView, let the Clerk component handle it
        if (Capacitor.isNativePlatform()) return;

        // If we're NOT in Capacitor (i.e., this is Chrome Custom Tab during OAuth),
        // bounce back to the app with the query params so the WebView can process them
        const queryParams = window.location.search;
        if (queryParams) {
            setIsNativeBrowser(true);
            window.location.href = `myduolingo://sso-callback${queryParams}`;

            // Fallback message if the app doesn't open
            const timeout = setTimeout(() => {
                const el = document.getElementById("fallback-msg");
                if (el) el.style.display = "block";
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, []);

    // If we detected we're in Chrome, show a simple loading while the deep link fires
    if (isNativeBrowser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white flex-col gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                <p className="text-slate-500 font-bold">A voltar para a App...</p>
                <p id="fallback-msg" className="text-xs text-slate-400 hidden mt-4 text-center px-6">
                    Se a aplicação não abrir automaticamente, fecha esta janela e volta à aplicação.
                </p>
            </div>
        );
    }

    // Normal flow: inside the WebView, let Clerk process the OAuth token
    return (
        <div className="flex h-full w-full min-h-screen flex-col items-center justify-center bg-white z-50 fixed inset-0">
            <AuthenticateWithRedirectCallback 
                signUpForceRedirectUrl="/learn" 
                signInForceRedirectUrl="/learn" 
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
                        0% { transform: scaleX(0); }
                        50% { transform: scaleX(1); }
                        100% { transform: scaleX(0); transform-origin: right; }
                    }
                `}</style>
            </div>
        </div>
    );
}
