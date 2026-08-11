import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Trophy, FileBadge, Award, Coins } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

/**
 * "Create a dedicated achievement area" - previously 3 separate,
 * scattered top-level nav items (Certificates in "campus", Badges
 * also in "campus", Point History in "community"). One real hub now.
 *
 * A plain children-based wrapper, not a React Router nested layout -
 * matches AcademicLayout's own established reasoning exactly: Badges
 * has real sub-routes (/app/badges/:id, /app/badges/new), and nesting
 * all of that under one parent risked real route-ordering bugs for a
 * cosmetic win. Clicking into a specific badge naturally leaves the
 * hub view, the same way detail pages usually do.
 *
 * Tabs are role-aware: Certificates and Points History are real
 * STUDENT-only endpoints (GET .../me routes), while Badges is shared
 * across every CAMPUS_ROLES role and reachable at this same URL from
 * Faculty/Org Admin's own standalone nav entry too. Showing the
 * student-only tabs to a non-student here would repeat the exact
 * broken-tab mistake found and fixed in AcademicLayout earlier - a
 * tab pointing at a route that genuinely rejects the current role.
 */
export function AchievementsHubLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isStudent = user?.role === UserRole.STUDENT;

  const tabs = [
    ...(isStudent
      ? [{ to: "/app/certificates", label: "Certificates", icon: FileBadge, end: true }]
      : []),
    { to: "/app/badges", label: "Badges", icon: Award, end: !isStudent },
    ...(isStudent ? [{ to: "/app/point-history", label: "Points History", icon: Coins }] : []),
  ];

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="constellation" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Trophy className="h-6 w-6 text-primary" aria-hidden="true" />
        {isStudent ? "Achievements" : "Badges"}
      </h1>

      <nav aria-label="Achievements" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
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
