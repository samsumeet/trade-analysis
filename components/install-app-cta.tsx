"use client";

import { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

import { usePwa } from "@/components/pwa-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InstallAppCtaProps {
  variant?: "button" | "banner";
}

export function InstallAppCta({ variant = "button" }: InstallAppCtaProps) {
  const { canInstall, isAndroid, isIos, isStandalone, promptInstall } = usePwa();
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  if (isStandalone || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    if (isIos) {
      setShowIosHelp(true);
      return;
    }

    setIsPrompting(true);
    await promptInstall();
    setIsPrompting(false);
  };

  if (variant === "button") {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void handleInstall()}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Install app
        </Button>
        {showIosHelp ? <IosInstallHelp onClose={() => setShowIosHelp(false)} /> : null}
      </>
    );
  }

  if (dismissedBanner) {
    return null;
  }

  return (
    <>
      <Card className="rounded-[28px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
        <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Installable app</Badge>
              {isAndroid ? <Badge variant="default">Android ready</Badge> : null}
              {isIos ? <Badge variant="default">iPhone ready</Badge> : null}
            </div>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
              Install AI Stock Analyses on your home screen
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Launch it like a native app with faster repeat loads, standalone navigation,
              and touch-friendly access to your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => void handleInstall()} className="gap-2">
              <Smartphone className="h-4 w-4" />
              {isPrompting ? "Preparing..." : isIos ? "How to install" : "Add to home screen"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setDismissedBanner(true)}>
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
      {showIosHelp ? <IosInstallHelp onClose={() => setShowIosHelp(false)} /> : null}
    </>
  );
}

function IosInstallHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-lg sm:items-center sm:p-4">
      <Card className="h-[88dvh] w-full overflow-hidden rounded-t-[28px] border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950 sm:h-auto sm:max-h-[88dvh] sm:max-w-lg sm:rounded-[28px]">
        <CardContent className="h-full overflow-y-auto p-5 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.85rem))] overscroll-contain sm:p-6 sm:pb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="info">Install on iPhone</Badge>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50 sm:text-2xl">
                Add this app from Safari
              </h3>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ol className="mt-5 space-y-3 text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-7">
            <li>1. Open this site in Safari on your iPhone or iPad.</li>
            <li>2. Tap the Share button in the browser toolbar.</li>
            <li>3. Choose “Add to Home Screen”.</li>
            <li>4. Confirm the app name and tap “Add”.</li>
          </ol>
          <p className="mt-5 text-xs leading-6 text-slate-500 dark:text-slate-400">
            After installation, the app opens in standalone mode with its own icon on the home
            screen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
