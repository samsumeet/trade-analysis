import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full rounded-2xl border-white/70 bg-white/80 transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/80">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
