"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

interface PwaContextValue {
  canInstall: boolean;
  isStandalone: boolean;
  isIos: boolean;
  isAndroid: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unsupported">;
}

const PwaContext = createContext<PwaContextValue | null>(null);

function detectIos() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function detectAndroid() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /android/i.test(navigator.userAgent);
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const pullingRef = useRef(false);

  useEffect(() => {
    setIsIos(detectIos());
    setIsAndroid(detectAndroid());
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches || Boolean(window.navigator.standalone)
    );
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!(isIos || isAndroid)) {
      return;
    }

    const threshold = 72;
    const maxPull = 104;

    const resetPull = () => {
      touchStartYRef.current = null;
      pullingRef.current = false;
      setPullDistance(0);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isRefreshing || event.touches.length !== 1) {
        return;
      }

      if (window.scrollY > 0) {
        touchStartYRef.current = null;
        pullingRef.current = false;
        return;
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null;
      pullingRef.current = Boolean(touchStartYRef.current);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!pullingRef.current || touchStartYRef.current === null || isRefreshing) {
        return;
      }

      if (window.scrollY > 0) {
        resetPull();
        return;
      }

      const currentY = event.touches[0]?.clientY ?? 0;
      const delta = currentY - touchStartYRef.current;

      if (delta <= 0) {
        setPullDistance(0);
        return;
      }

      const nextDistance = Math.min(maxPull, delta * 0.55);
      setPullDistance(nextDistance);

      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (isRefreshing) {
        return;
      }

      const shouldRefresh = pullDistance >= threshold;
      touchStartYRef.current = null;
      pullingRef.current = false;

      if (!shouldRefresh) {
        setPullDistance(0);
        return;
      }

      setIsRefreshing(true);
      setPullDistance(threshold);

      window.setTimeout(() => {
        window.location.reload();
      }, 120);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", resetPull, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", resetPull);
    };
  }, [isAndroid, isIos, isRefreshing, pullDistance]);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return "unsupported" as const;
    }

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
    }

    return result.outcome;
  }, [deferredPrompt]);

  const value = useMemo(
    () => ({
      canInstall: Boolean(deferredPrompt) || isIos,
      isStandalone,
      isIos,
      isAndroid,
      promptInstall
    }),
    [deferredPrompt, isAndroid, isIos, isStandalone, promptInstall]
  );

  const progress = Math.min(pullDistance / 72, 1);
  const showPullIndicator = isRefreshing || pullDistance > 6;

  return (
    <PwaContext.Provider value={value}>
      {showPullIndicator ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[98] flex justify-center"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)",
            transform: `translateY(${Math.max(pullDistance - 72, 0)}px)`
          }}
        >
          <div className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Loader2
                className={`h-4 w-4 text-blue-600 dark:text-blue-300 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                style={{
                  transform: isRefreshing ? undefined : `rotate(${progress * 220}deg)`,
                  transition: "transform 120ms ease"
                }}
              />
              <span>
                {isRefreshing
                  ? "Refreshing..."
                  : progress >= 1
                    ? "Release to refresh"
                    : "Pull to refresh"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);

  if (!context) {
    throw new Error("usePwa must be used inside PwaProvider.");
  }

  return context;
}
