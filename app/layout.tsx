import type { Metadata } from "next";

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
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
