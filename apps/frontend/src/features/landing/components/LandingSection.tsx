import type { ReactNode } from "react";

import { PageAtmosphere, type AtmosphereVariant } from "@/shared/components/PageAtmosphere";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { cn } from "@/utils/cn";

interface LandingSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  atmosphere?: AtmosphereVariant;
  children?: ReactNode;
  className?: string;
}

/**
 * Shared section shell for every Landing Page chapter below the Hero —
 * reused rather than duplicating the same eyebrow/title/description
 * header markup 8+ times. Each section can carry its own subtle
 * atmosphere variant, so scrolling through the page itself
 * foreshadows the per-page atmosphere system inside the real app
 * (Dashboard = particles, Leaderboard = constellation, etc.) —
 * the landing page becomes chapter one of the same visual story.
 *
 * The header reveals on scroll automatically (ScrollReveal) so every
 * section arrives with the same entrance rhythm without each consumer
 * repeating that wiring.
 */
export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  atmosphere,
  children,
  className,
}: LandingSectionProps) {
  return (
    <section id={id} className={cn("relative overflow-hidden px-6 py-24 sm:py-28", className)}>
      {atmosphere && <PageAtmosphere variant={atmosphere} />}
      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 font-body text-muted-foreground">{description}</p>
          )}
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}
