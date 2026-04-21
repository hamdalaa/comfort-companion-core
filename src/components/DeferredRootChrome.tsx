import { lazy, Suspense, useEffect, useState } from "react";
import { useUserPrefs } from "@/lib/userPrefs";

const LazyCommandPalette = lazy(() =>
  import("./CommandPalette").then((module) => ({ default: module.CommandPalette })),
);
const LazyWelcomeTour = lazy(() =>
  import("./WelcomeTour").then((module) => ({ default: module.WelcomeTour })),
);
const LazyCompareBar = lazy(() =>
  import("./CompareBar").then((module) => ({ default: module.CompareBar })),
);
const LazyRecentlyViewedStrip = lazy(() =>
  import("./RecentlyViewedStrip").then((module) => ({ default: module.RecentlyViewedStrip })),
);

function scheduleIdle(callback: () => void, timeout = 2500) {
  if (typeof window === "undefined") return () => undefined;
  if ("requestIdleCallback" in window) {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback?.(handle);
  }

  const handle = (window as Window).setTimeout(callback, timeout);
  return () => (window as Window).clearTimeout(handle);
}

export function DeferredRootChrome() {
  const { compare, onboarded, tourTrigger } = useUserPrefs();
  const [commandEnabled, setCommandEnabled] = useState(false);
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [forceCommandOpenToken, setForceCommandOpenToken] = useState(0);

  useEffect(() => {
    const cancelCommand = scheduleIdle(() => setCommandEnabled(true), 2200);
    const cancelWelcome = !onboarded || tourTrigger > 0
      ? scheduleIdle(() => setWelcomeEnabled(true), tourTrigger > 0 ? 0 : 1800)
      : () => undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      setCommandEnabled(true);
      setForceCommandOpenToken((token) => token + 1);
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      cancelCommand();
      cancelWelcome();
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [onboarded, tourTrigger]);

  return (
    <>
      {commandEnabled && (
        <Suspense fallback={null}>
          <LazyCommandPalette forceOpenToken={forceCommandOpenToken} />
        </Suspense>
      )}

      {welcomeEnabled && (
        <Suspense fallback={null}>
          <LazyWelcomeTour />
        </Suspense>
      )}

      {compare.length > 0 && (
        <Suspense fallback={null}>
          <LazyCompareBar />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <LazyRecentlyViewedStrip />
      </Suspense>
    </>
  );
}
