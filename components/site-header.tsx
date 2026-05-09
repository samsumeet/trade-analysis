import { BrandLogo } from "@/components/brand-logo";
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
  return (
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
        <Button asChild variant="secondary" size="sm">
          <a href={ctaHref}>{ctaLabel}</a>
        </Button>
      </div>
    </header>
  );
}
