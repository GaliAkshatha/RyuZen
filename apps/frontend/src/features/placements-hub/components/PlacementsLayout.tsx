import { NavLink, Outlet } from "react-router-dom";
import { Building2, BriefcaseBusiness, Send, Briefcase } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

/**
 * "Same for placement section" - one real hub with a persistent tab
 * strip, mirroring AIToolsLayout exactly. "My Applications" is real,
 * STUDENT-only data (apply + "mine" are STUDENT-only server-side), so
 * it's the one tab conditionally shown - not just hidden by CSS, the
 * tab genuinely isn't rendered for non-students, matching what the
 * route itself already enforces.
 */
export function PlacementsLayout() {
  const { user } = useAuth();
  const isStudent = user?.role === UserRole.STUDENT;

  const tabs = [
    { to: "/app/placements/companies", label: "Companies", icon: Building2 },
    { to: "/app/placements/drives", label: "Drives", icon: BriefcaseBusiness },
    ...(isStudent
      ? [{ to: "/app/placements/applications", label: "My Applications", icon: Send }]
      : []),
  ];

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="arcane-grid" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Briefcase className="h-6 w-6 text-primary" aria-hidden="true" />
        Placements
      </h1>

      <nav aria-label="Placements" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
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

      <Outlet />
    </div>
  );
}
