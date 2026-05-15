"use client";

import { useEffect } from "react";

interface AutoPrintProps {
  enabled: boolean;
}

export function AutoPrint({ enabled }: AutoPrintProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.print();
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [enabled]);

  return null;
}
