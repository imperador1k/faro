export function registerSW() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (process.env.NODE_ENV === "development") return;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("[SW] Registered:", reg.scope);

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (installing) {
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              console.log("[SW] Update available");
            }
          });
        }
      });
    } catch (err) {
      console.warn("[SW] Registration failed:", err);
    }
  });
}
