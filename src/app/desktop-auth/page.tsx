"use client";
import { useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * DesktopAuth — Runs inside the Tauri WebView after receiving the deep link.
 *
 * Flow:
 * 1. NativeBridge catches myduolingo://desktop-auth?token=xxx
 * 2. Navigates WebView to /desktop-auth?token=xxx
 * 3. This page uses the Clerk "ticket" strategy to sign in (no nonce needed)
 * 4. Clerk creates a new session in the Tauri WebView context
 * 5. Redirects to /learn
 */
export default function DesktopAuthPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !signIn || !setActive) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("[DesktopAuth] No token found in URL");
      router.replace("/sign-in");
      return;
    }

    const authenticate = async () => {
      try {
        const result = await signIn.create({
          strategy: "ticket",
          ticket: token,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          router.replace("/learn");
        } else {
          console.error(
            "[DesktopAuth] Unexpected sign-in status:",
            result.status,
          );
          router.replace("/sign-in");
        }
      } catch (err) {
        console.error("[DesktopAuth] Authentication failed:", err);
        router.replace("/sign-in");
      }
    };

    authenticate();
  }, [isLoaded, signIn, setActive, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900 flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      <p className="text-slate-500 dark:text-slate-400 font-bold">
        A autenticar na aplicação...
      </p>
    </div>
  );
}
