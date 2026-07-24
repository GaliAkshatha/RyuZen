import type { LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { cn } from "@/utils/cn";

export interface TimelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

/**
 * Shared sequential-storytelling layout — used by both the Career and
 * Placements sections instead of each building its own step-by-step
 * markup. A connecting line runs behind the numbered nodes so each
 * step visually leads into the next, rather than reading as another
 * disconnected card grid.
 */
export function Timeline({ steps }: TimelineProps) {
  return (
    <div className="relative">
      <div
        className="absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:block"
        aria-hidden="true"
      />
      <ol className="flex flex-col gap-8">
        {steps.map((step, i) => (
          <ScrollReveal key={step.title} as="li" delay={i * 100}>
            <div className="flex items-start gap-5">
              <span
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-primary ring-2 ring-primary/30",
                )}
              >
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="pt-1.5">
                <p className="font-body text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {i + 1}
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 font-body text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </ol>
    </div>
  );
}
