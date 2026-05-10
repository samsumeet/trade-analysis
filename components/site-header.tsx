"use client";

import { BrandLogo } from "@/components/brand-logo";
import { useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/components/auth-provider";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const { isAuthenticated, logout, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <>
      <header className="container flex items-center justify-between py-6">
        <div>
          <BrandLogo href="/" priority />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">AI equity research terminal</p>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
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

          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:block">
                {user?.name}
              </div>
              {user?.accountTier === "free" ? (
                <Button type="button" size="sm" onClick={() => setIsUpgradeModalOpen(true)}>
                  Upgrade
                </Button>
              ) : null}
              <Button type="button" variant="secondary" size="sm" onClick={() => void logout()}>
                Log out
              </Button>
            </>
          ) : (
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
              Log in
            </Button>
          )}
          <Button asChild size="sm">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
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
