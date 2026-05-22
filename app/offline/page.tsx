"use client";

import { WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-10">
      <Card className="w-full max-w-xl rounded-[32px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
        <CardContent className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <WifiOff className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-slate-950 dark:text-slate-50">
            You&apos;re offline
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The app shell is installed, but this screen needs a connection for fresh
            stock analysis. Reconnect to sync live data, headlines, and report updates.
          </p>
          <div className="mt-8 flex justify-center">
            <Button type="button" onClick={() => window.location.reload()}>
              Retry connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
