import { PlayCircle, Quote } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

/**
 * Demo + Testimonials, combined into one section rather than two
 * consecutive "coming soon" blocks — better pacing, and both are
 * honest placeholders: no fake video embed, no invented customer
 * quotes attributed to fictional people. Still visually premium, same
 * glow language as everywhere else, so "not populated yet" doesn't
 * read as "unfinished."
 */
export function PreviewSection() {
  return (
    <LandingSection id="demo" eyebrow="See It For Yourself" title="More to come, soon">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ScrollReveal>
          <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 text-center shadow-[0_0_60px_-20px_hsl(var(--primary)/0.3)]">
            <PlayCircle className="h-12 w-12 text-primary/60" aria-hidden="true" />
            <p className="font-body text-sm text-muted-foreground">
              A full product walkthrough is on its way.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm">
            <Quote className="h-10 w-10 text-primary/50" aria-hidden="true" />
            <p className="font-body text-sm text-muted-foreground">
              As more campuses join RyuZen, we'll share real stories from the students and faculty
              using it every day.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </LandingSection>
  );
}
