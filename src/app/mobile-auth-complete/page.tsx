"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

/**
 * MobileAuthComplete — Landing page after successful Google OAuth in Chrome (desktop flow).
 *
 * Flow:
 * 1. Chrome finishes OAuth → Clerk redirects here (redirectUrlComplete)
 * 2. User is now signed in within Chrome
 * 3. We call our API to get a short-lived Clerk sign-in ticket
 * 4. We bounce to Tauri via deep link: myduolingo://desktop-auth?token=xxx
 * 5. Tauri WebView uses the ticket to create its own session
 */
export default function MobileAuthCompletePage() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const isDesktop = params.get("desktop") === "true";

    // Non-desktop path: shouldn't reach here normally
    if (!isDesktop) {
      window.location.href = "/learn";
      return;
    }

    if (!isSignedIn) {
      // Auth failed somehow — go back to sign-in
      window.location.href = "/sign-in";
      return;
    }

    const getDesktopToken = async () => {
      try {
        const res = await fetch("/api/auth/desktop-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to get desktop token");

        const { token } = await res.json();
        // Deep link to Tauri with the ticket
        window.location.href = `myduolingo://desktop-auth?token=${token}`;
      } catch (err) {
        console.error("[MobileAuthComplete] Token error:", err);
        window.location.href = "/sign-in";
      }
    };

    getDesktopToken();
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      <p className="text-slate-500 font-bold">
        A finalizar a ligação com a App...
      </p>
    </div>
  );
}
