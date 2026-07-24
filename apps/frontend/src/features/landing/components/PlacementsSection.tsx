import { Building2, ClipboardCheck, Send, TrendingUp } from "lucide-react";

import { LandingSection } from "@/features/landing/components/LandingSection";
import { Timeline } from "@/features/landing/components/Timeline";

const PLACEMENT_STEPS = [
  {
    icon: Building2,
    title: "Discover verified companies",
    description: "Browse the companies actively recruiting from your organization — no guessing which drives are real.",
  },
  {
    icon: Send,
    title: "Apply in one click",
    description: "Apply to placement drives with a resume already built from your profile — no re-uploading, no re-typing.",
  },
  {
    icon: ClipboardCheck,
    title: "Watch your status update",
    description: "Track every application — applied, shortlisted, selected — without emailing anyone to ask.",
  },
  {
    icon: TrendingUp,
    title: "See the real outcomes",
    description: "Organizations see genuine placement-rate data, not vanity metrics — built from real applications and outcomes.",
  },
];

export function PlacementsSection() {
  return (
    <LandingSection
      id="placements"
      eyebrow="From Campus to Career"
      title="Placements, without the spreadsheet chaos"
      description="One connected pipeline from posting a drive to accepting an offer — for students, faculty, and organizations alike."
    >
      <div className="mx-auto max-w-2xl">
        <Timeline steps={PLACEMENT_STEPS} />
      </div>
    </LandingSection>
  );
}
