import Image from "next/image";

import { BrandLogo } from "@/components/brand-logo";

const footerLinks = ["Features", "Pricing", "Workflow", "Disclaimer", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 py-10 dark:border-slate-800">
      <div className="container flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <Image
                src="/brand/ai-stock-analysis-icon.svg"
                alt="AI Stock Analyses icon"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
            <BrandLogo className="max-w-[200px] sm:max-w-[260px]" />
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Market analysis is for informational purposes only and is not
            financial advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
