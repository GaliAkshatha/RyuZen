import { Link } from "react-router-dom";
import { ArrowRight, Palette, ShieldCheck, Users2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { LandingSection } from "@/features/landing/components/LandingSection";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

const POINTS = [
  {
    icon: Users2,
    title: "One platform, every role",
    description: "Students, faculty, alumni, and administrators share one system — permissions and dashboards differ, the data never fragments.",
  },
  {
    icon: ShieldCheck,
    title: "Your organization, your data",
    description: "Every record — activities, achievements, placements — is scoped to your organization alone.",
  },
  {
    icon: Palette,
    title: "Your identity, not ours",
    description: "Built to carry your branding, not a generic template every campus looks identical in.",
  },
];

export function OrganizationsSection() {
  return (
    <LandingSection
      id="organizations"
      atmosphere="glow"
      eyebrow="For Institutions"
      title="Bring your entire campus onto one system"
      description="RyuZen isn't a tool bolted onto your existing processes — it's the operating system your campus runs on."
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {POINTS.map((point, i) => (
          <ScrollReveal key={point.title} delay={i * 100}>
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <point.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold text-foreground">{point.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{point.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={300} className="mt-12 flex justify-center">
        <Button size="lg" asChild>
          <Link to="/auth/register" className="flex items-center gap-2">
            Register Your Organization
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </ScrollReveal>
    </LandingSection>
  );
}
