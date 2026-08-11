import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Briefcase, Users, Search } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

const TABS = [
  { to: "/app/recruiter", label: "Overview", icon: Briefcase, end: true },
  { to: "/app/recruiter/applicants", label: "Applicants", icon: Users },
  { to: "/app/recruiter/search", label: "Candidate Search", icon: Search },
];

/**
 * Real IA restructuring, recorded and now implemented per the agreed
 * plan: the previous monolithic RecruiterDashboardPage split into
 * separate, URL-addressable workspaces (matching the same Rule 67
 * reasoning already applied to Growth). Only Overview/Applicants/
 * Candidate Search are built here - My Drives, Interviews (as a
 * standalone aggregate), Evaluations, and Company are deliberately
 * NOT included yet. Each of those needs either a new backend
 * self-lookup capability (no GET /recruiters/me exists to safely
 * derive "my company" without approximating from applicant data) or a
 * new aggregation pattern (no "all my interview rounds across
 * applications" endpoint exists) - not invented here, flagged for a
 * real backend-design pass instead.
 */
export function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="font-display text-2xl font-semibold text-foreground">Recruiter</h1>

      <nav aria-label="Recruiter" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {children}
    </div>
  );
}
