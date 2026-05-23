"use client";

import { BrandLogo } from "@/components/brand-logo";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/components/auth-provider";
import { InstallAppCta } from "@/components/install-app-cta";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  navItems: NavItem[];
  ctaHref?: string;
  ctaLabel?: string;
}

export function SiteHeader({
  navItems,
  ctaHref = "/dashboard",
  ctaLabel = "Open Dashboard"
}: SiteHeaderProps) {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleUpgradeModal() {
      setIsUpgradeModalOpen(true);
    }

    window.addEventListener("openUpgradeModal", handleUpgradeModal);
    return () => window.removeEventListener("openUpgradeModal", handleUpgradeModal);
  }, []);

  return (
    <>
      <header className="container safe-pt pb-4 sm:pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <BrandLogo href="/" priority className="max-w-[220px] sm:max-w-none" />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              AI equity research terminal
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated ? (
              <nav className="flex gap-6 text-sm text-slate-600 dark:text-slate-300">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-slate-950 dark:hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            ) : null}

            <InstallAppCta variant="button" />
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button type="button" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                Log in / Sign up
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-4 rounded-[28px] border border-slate-200/80 bg-white/95 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={ctaHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {ctaLabel}
              </a>
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <InstallAppCta variant="button" />
              {isAuthenticated ? (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                  <UserMenu />
                </div>
              ) : (
                <Button type="button" onClick={() => setIsAuthModalOpen(true)}>
                  Log in / Sign up
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
