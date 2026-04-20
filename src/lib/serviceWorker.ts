export function registerServiceWorkerOnIdle() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  const register = () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore SW registration failures.
    });
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(register, { timeout: 4000 });
    return;
  }

  window.setTimeout(register, 2500);
}
