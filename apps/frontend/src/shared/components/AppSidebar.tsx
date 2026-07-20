import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";
import { getNavItemsForRole, type NavGroup } from "@/shared/constants/navRegistry";
import { resolveIcon } from "@/shared/constants/iconMap";
import type { UserRole } from "@/types/enums";

const GROUP_ORDER: NavGroup[] = ["main", "career", "placements", "ai", "admin"];

const GROUP_LABELS: Partial<Record<NavGroup, string>> = {
  career: "Career",
  placements: "Placements",
  ai: "AI Tools",
  admin: "Administration",
};

export interface AppSidebarProps {
  /**
   * Accepted as a direct prop rather than read internally from
   * AuthContext, so this component is testable in isolation by feeding
   * it any role (matching F7's own Definition of Done). F8 passes
   * `user.role` when assembling the real layouts.
   */
  role: UserRole;
  className?: string;
}

export function AppSidebar({ role, className }: AppSidebarProps) {
  const items = getNavItemsForRole(role);

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-6 p-4", className)}>
      {GROUP_ORDER.map((group) => {
        const groupItems = items.filter((item) => item.group === group);
        if (groupItems.length === 0) return null;

        const label = GROUP_LABELS[group];

        return (
          <div key={group} className="flex flex-col gap-1">
            {label && (
              <p className="px-2 font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
            )}
            {groupItems.map((item) => {
              const Icon = resolveIcon(item.icon);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
