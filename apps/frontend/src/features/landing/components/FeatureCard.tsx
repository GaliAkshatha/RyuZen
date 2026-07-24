import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * The Landing Page's equivalent of WidgetCard's glow treatment —
 * deliberately the same visual grammar (icon in a glowing token-driven
 * badge, hover lift, glow border) as the dashboards a visitor will
 * land on right after registering, so the marketing page and the real
 * product don't feel like two different pieces of software.
 */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-[0_0_32px_-10px_hsl(var(--primary)/0.4)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="font-body text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
