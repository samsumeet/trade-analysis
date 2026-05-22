import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Stock Analyses",
    short_name: "AI Stocks",
    description:
      "AI-powered stock analysis dashboard with live trade briefs, watchlists, history, and shareable reports.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#020617",
    categories: ["finance", "business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/brand/ai-stock-analysis-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Open dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
        description: "Jump straight into the stock analysis dashboard."
      },
      {
        name: "Profile",
        short_name: "Profile",
        url: "/profile",
        description: "Open your profile, watchlist, and usage details."
      }
    ]
  };
}
