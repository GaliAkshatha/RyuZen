import { Activity, Award, FileText, MessageSquare, Trophy, Users } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { FeatureCard } from "@/features/landing/components/FeatureCard";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

const FEATURES = [
  {
    icon: Activity,
    title: "Activities & Submissions",
    description: "Join campus activities, submit your work, and get real feedback from faculty — every contribution counted.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & XP",
    description: "Every activity, event, and achievement earns real points. Track your rank against the entire campus.",
  },
  {
    icon: Award,
    title: "Achievements & Badges",
    description: "Verified achievements and earned badges build a record employers can trust — not just a list you typed.",
  },
  {
    icon: FileText,
    title: "Resume & Portfolio",
    description: "Generate a polished resume from your real activity, skills, and achievements — always up to date.",
  },
  {
    icon: MessageSquare,
    title: "Campus Chat",
    description: "Message faculty, mentors, and peers directly — no more chasing people down in the hallway.",
  },
  {
    icon: Users,
    title: "Mentorship",
    description: "Get paired with faculty or alumni who've walked the path you're on.",
  },
];

export function FeaturesSection() {
  return (
    <LandingSection
      id="features"
      eyebrow="Inside the Academy"
      title="One campus, every system connected"
      description="Activities, achievements, mentorship, and career tools — built as one continuous experience, not a pile of disconnected tools."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.title} delay={i * 60}>
            <FeatureCard {...feature} />
          </ScrollReveal>
        ))}
      </div>
    </LandingSection>
  );
}
