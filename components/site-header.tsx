import { Button } from "@/components/ui/button";

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
        <a href="/" className="text-lg font-semibold text-slate-950">
          trade-analysis
        </a>
        <p className="text-sm text-slate-500">AI equity research terminal</p>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </nav>

        <Button asChild variant="secondary" size="sm">
          <a href={ctaHref}>{ctaLabel}</a>
        </Button>
      </div>
    </header>
  );
}
