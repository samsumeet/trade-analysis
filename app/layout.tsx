import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "trade-analysis",
  description:
    "AI-powered trade analysis website with interactive stock dashboard previews, trade plans, indicator analysis, and sample reports."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              const storageKey = "trade-analysis:theme";
              const stored = window.localStorage.getItem(storageKey);
              const theme = stored === "dark" || stored === "light"
                ? stored
                : "light";
              document.documentElement.classList.toggle("dark", theme === "dark");
              document.documentElement.style.colorScheme = theme;
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
