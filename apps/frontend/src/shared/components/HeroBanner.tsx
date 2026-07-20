import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Used at the top of dashboards (per D1) — one restrained gradient
 * treatment using the primary (brass/gold) token, rather than a
 * decorative image or busy pattern. This is deliberately the one place
 * in the composite set that spends a little visual boldness, per the
 * design skill's "spend your boldness in one place, keep everything
 * around it quiet" principle — everywhere else stays plain cards.
 */
export function HeroBanner({ title, subtitle, actions, className }: HeroBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/15 via-card to-card p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="font-body text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
