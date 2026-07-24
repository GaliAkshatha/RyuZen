import { Award, Crown, Medal } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { Avatar, AvatarFallback } from "@/shared/ui/Avatar";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

/**
 * The emotional peak of the story so far — deliberately given more
 * breathing room than the sections around it (wider max-width, larger
 * gaps) so it reads as a cinematic beat, not another feature row.
 * Reuses the exact LevelProgressRing component that powers the real
 * Dashboard, Profile, and Leaderboard — a visitor who later logs in
 * recognizes this ring, not a similar-looking recreation of it.
 * Illustrative example numbers only (there's no logged-in user on the
 * Landing Page); framed visually as a preview, not a claim about
 * "your" data.
 */
export function GamificationSection() {
  const cards = [
    {
      content: <LevelProgressRing level={12} progress={0.68} size={104} />,
      copy: "Every activity, event, and verified achievement earns real XP toward your next level.",
    },
    {
      content: (
        <div className="flex items-center gap-2">
          <Crown className="h-11 w-11 text-primary motion-safe:animate-float" aria-hidden="true" />
          <Avatar className="h-16 w-16 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
            <AvatarFallback className="font-display font-bold">#1</AvatarFallback>
          </Avatar>
        </div>
      ),
      copy: "A real podium for the top of the leaderboard — rank climbing is visible, not buried in a table.",
    },
    {
      content: (
        <div className="flex gap-2">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <Medal className="h-7 w-7 text-primary" aria-hidden="true" />
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 ring-1 ring-warning/30">
            <Award className="h-7 w-7 text-warning" aria-hidden="true" />
          </span>
        </div>
      ),
      copy: "Verified achievements and badges that mean something — faculty-confirmed, not self-reported.",
    },
  ];

  return (
    <LandingSection
      atmosphere="constellation"
      eyebrow="Every Point Counts"
      title="Progress that actually feels like progress"
      description="XP for real activity. Levels you can see climbing. A podium for the students who show up. This isn't a progress bar for its own sake — it's how RyuZen keeps momentum visible."
      className="py-32 sm:py-40"
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {cards.map((card, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-card/60 p-8 text-center backdrop-blur-sm">
              {card.content}
              <p className="font-body text-sm text-muted-foreground">{card.copy}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </LandingSection>
  );
}
