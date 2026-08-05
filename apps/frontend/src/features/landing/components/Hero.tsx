import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useParallax } from "@/hooks/useParallax";

/**
 * Opening chapter, not a marketing banner. Composition notes:
 * - Atmosphere drifts at a different rate than content on scroll
 *   (subtle parallax, ~15% of scroll distance) — reads as depth, not
 *   a gimmick, and disables entirely under reduced-motion.
 * - Text reveals in sequence on mount (eyebrow → title → subtitle →
 *   description → CTAs), each held by `both` fill-mode so nothing
 *   flashes before its animation starts.
 * - "RYUZEN" itself carries a slow gradient sheen (shimmer) rather
 *   than sitting flat — the one place on the page that spends real
 *   visual boldness, matching the same "spend it in one place" design
 *   principle the dashboards already follow.
 */
export function Hero() {
  const parallaxOffset = useParallax(0.15);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div style={{ transform: `translateY(${parallaxOffset}px)` }}>
        <PageAtmosphere variant="particles" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <p
          className="mb-4 flex items-center justify-center gap-2 font-body text-sm uppercase tracking-[0.4em] text-primary motion-safe:animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Chapter One
        </p>

        <h1
          className="mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-[length:200%_auto] bg-clip-text font-display text-6xl font-black tracking-tight text-transparent motion-safe:animate-fade-in-up motion-safe:animate-shimmer sm:text-8xl"
          style={{ animationDelay: "150ms" }}
        >
          RYUZEN
        </h1>

        <p
          className="mb-4 font-display text-2xl font-semibold text-foreground motion-safe:animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          The AI-Powered Campus Operating System
        </p>

        <p
          className="mx-auto mb-10 max-w-xl font-body text-muted-foreground motion-safe:animate-fade-in-up"
          style={{ animationDelay: "450ms" }}
        >
          Where every activity earns XP, every achievement is celebrated, and every student's
          journey — from first login to first offer letter — feels like an adventure worth
          finishing.
        </p>

        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row motion-safe:animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <Button size="lg" asChild>
            <a href="#contact" className="flex items-center gap-2">
              Begin Your Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link to="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-float"
        aria-label="Scroll to explore"
      >
        <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/40 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
      </button>
    </section>
  );
}
