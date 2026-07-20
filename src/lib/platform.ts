export type Platform =
  | "tauri"
  | "capacitor"
  | "android"
  | "ios"
  | "windows"
  | "macos"
  | "linux"
  | "pwa";

export function detectPlatform(): Platform {
  if (typeof window === "undefined") return "pwa";

  // Detect Tauri via globals (withGlobalTauri: true) OR via custom UserAgent
  // The UserAgent "Faro TauriDesktop" is set in tauri.conf.json and is the
  // most reliable fallback if globals haven't been injected yet.
  if (
    (window as any).__TAURI__ ||
    (window as any).__TAURI_INTERNALS__ ||
    navigator.userAgent.includes("TauriDesktop")
  )
    return "tauri";
  if ((window as any).Capacitor?.isNative) return "capacitor";

  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/win/i.test(ua)) return "windows";
  if (/mac/i.test(ua)) return "macos";
  if (/linux/i.test(ua)) return "linux";

  return "pwa";
}

export function isRunningAsPWA(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}
