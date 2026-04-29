"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { LottieAnimation } from "@/components/ui/lottie-animation";

export default function SSOCallbackPage() {
    return (
        <div className="flex h-full w-full min-h-screen flex-col items-center justify-center bg-white z-50 fixed inset-0">
            {/* O componente do Clerk processa o token do Google e cria a sessão local na WebView! */}
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
