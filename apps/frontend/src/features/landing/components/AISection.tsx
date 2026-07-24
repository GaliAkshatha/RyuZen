import { Bot, FileSearch, Gauge, Lightbulb, MessagesSquare } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { cn } from "@/utils/cn";

const AI_FEATURES = [
  {
    icon: MessagesSquare,
    title: "AI Chat Assistant",
    description: "Ask questions about your courses, career path, or campus life — anytime, in plain language.",
  },
  {
    icon: FileSearch,
    title: "Resume Review",
    description: "Get instant, structured feedback on your resume's strengths and gaps before a recruiter ever sees it.",
  },
  {
    icon: Gauge,
    title: "Career Score",
    description: "A single number that combines your leaderboard standing, resume quality, and verified achievements.",
  },
  {
    icon: Bot,
    title: "Mock Interviews",
    description: "Practice real interview questions for your target role and get feedback before the real thing.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Discover activities, events, and clubs picked from what you've actually engaged with — not a generic list.",
  },
];

/**
 * Deliberately NOT another 3-column card grid — an alternating
 * left/right showcase, each row reading almost like a page turning.
 * The visual rhythm itself (icon glow alternating sides) is the
 * variety the Landing Page needed against Features' grid before it.
 */
export function AISection() {
  return (
    <LandingSection
      id="ai"
      atmosphere="arcane-grid"
      eyebrow="Arcane Intelligence"
      title="AI woven into every step"
      description="Not a chatbot bolted onto the side — AI assistance built into the moments that matter: your resume, your interview prep, your next move."
    >
      <div className="flex flex-col gap-10">
        {AI_FEATURES.map((feature, i) => {
          const reversed = i % 2 === 1;
          return (
            <ScrollReveal key={feature.title} delay={i * 80}>
              <div
                className={cn(
                  "flex flex-col items-center gap-6 sm:flex-row",
                  reversed && "sm:flex-row-reverse",
                )}
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <feature.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className={cn("flex-1 text-center", reversed ? "sm:text-right" : "sm:text-left")}>
                  <h3 className="font-display text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </LandingSection>
  );
}
