import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { TrendingUp } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

const TABS = [
  { to: "/app/growth", label: "Overview", end: true },
  { to: "/app/growth/skills", label: "Skills" },
  { to: "/app/growth/projects", label: "Projects" },
  { to: "/app/growth/experience", label: "Experience & Education" },
  { to: "/app/growth/certifications", label: "Certifications" },
  { to: "/app/growth/achievements", label: "Achievements" },
  { to: "/app/growth/roadmap", label: "Roadmap" },
];

/**
 * Converted from local tab state to real, URL-addressable routes -
 * matches the Global Design System's own Rule 67 ("do not depend on
 * temporary React state for critical workflow state - use the URL")
 * and the Student spec's explicit nav structure (Growth as a group of
 * separate sidebar items: Overview, Skills, Projects, Experience,
 * Education, Certifications, Achievements). Every tab's actual
 * content (GrowthSkillsTab, GrowthAchievementsTab, etc.) is reused
 * completely unchanged - only the navigation mechanism changed, not
 * the components themselves.
 *
 * Children-based wrapper, matching AcademicLayout/AchievementsHub's
 * established pattern, not a nested <Outlet /> nav tree.
 */
export function GrowthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
        Growth
      </h1>

      <nav aria-label="Growth" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "rounded-md border border-border bg-card/60 px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {children}
    </div>
  );
}
