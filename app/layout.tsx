import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { AuthProvider } from "@/components/auth-provider";
import { PwaProvider } from "@/components/pwa-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Stock Analyses",
  description:
    "AI-powered trade analysis website with interactive stock dashboard previews, trade plans, indicator analysis, and sample reports.",
  applicationName: "AI Stock Analyses",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Stock Analyses"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/brand/ai-stock-analysis-icon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ]
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
        <AuthProvider>
          <PwaProvider>{children}</PwaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
