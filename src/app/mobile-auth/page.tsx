"use client";
import { useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function MobileAuthPage() {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  useEffect(() => {
    if (!signInLoaded || !signUpLoaded) return;

    const startAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isSignUp = searchParams.get("mode") === "sign-up";
      const isDesktop = searchParams.get("desktop") === "true";

      const redirectUrl = `${window.location.origin}/sso-callback${isDesktop ? "?desktop=true" : ""}`;
      const completeUrl = `${window.location.origin}/auth-success`;

      try {
        if (isSignUp) {
          await signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: redirectUrl,
            redirectUrlComplete: completeUrl,
          });
        } else {
          await signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: redirectUrl,
            redirectUrlComplete: completeUrl,
          });
        }
      } catch (error) {
        console.error("Erro ao iniciar auth:", error);
      }
    };

    startAuth();
  }, [signInLoaded, signUpLoaded, signIn, signUp]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      <p className="text-slate-500 font-bold">A conectar com a Google...</p>
    </div>
  );
}
