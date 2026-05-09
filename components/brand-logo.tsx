import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  priority = false
}: BrandLogoProps) {
  return (
    <a href={href} className={cn("inline-flex items-center", className)} aria-label="AI Stock Analyses home">
      <Image
        src="/brand/ai-stock-analysis-logo-light.svg"
        alt="AI Stock Analyses"
        width={380}
        height={86}
        priority={priority}
        className="h-11 w-auto dark:hidden sm:h-12"
      />
      <Image
        src="/brand/ai-stock-analysis-logo-dark.svg"
        alt="AI Stock Analyses"
        width={380}
        height={86}
        priority={priority}
        className="hidden h-11 w-auto dark:block sm:h-12"
      />
    </a>
  );
}
