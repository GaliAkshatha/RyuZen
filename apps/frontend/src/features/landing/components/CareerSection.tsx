import { Briefcase, FolderKanban, GraduationCap, Sparkles } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { Timeline } from "@/features/landing/components/Timeline";

const CAREER_STEPS = [
  {
    icon: Sparkles,
    title: "Skills build themselves",
    description: "Skills are inferred from your real projects, resume, and certificates — you confirm them, you don't type them from scratch.",
  },
  {
    icon: FolderKanban,
    title: "Your portfolio grows with you",
    description: "Showcase your projects with a portfolio that updates as you build, not a page you set up once and forget.",
  },
  {
    icon: GraduationCap,
    title: "Every credential, one place",
    description: "Certifications and education tied to the profile recruiters and faculty actually see.",
  },
  {
    icon: Briefcase,
    title: "It all becomes your Career Score",
    description: "Your standing, resume, and achievements combine into one number worth showing off.",
  },
];

export function CareerSection() {
  return (
    <LandingSection
      id="career"
      eyebrow="Your Path Forward"
      title="Built for where you're headed, not just where you are"
      description="Every career tool in RyuZen draws from the same real record — no separate resume builder disconnected from your actual campus achievements."
    >
      <div className="mx-auto max-w-2xl">
        <Timeline steps={CAREER_STEPS} />
      </div>
    </LandingSection>
  );
}
