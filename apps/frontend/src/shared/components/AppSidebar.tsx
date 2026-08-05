import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";
import { getNavItemsForRole, type NavGroup } from "@/shared/constants/navRegistry";
import { resolveIcon } from "@/shared/constants/iconMap";
import type { UserRole } from "@/types/enums";

const GROUP_ORDER: NavGroup[] = [
  "overview",
  "campus",
  "academic",
  "community",
  "career",
  "placements",
  "ai",
  "people",
  "organization",
  "insights",
];

const GROUP_LABELS: Partial<Record<NavGroup, string>> = {
  campus: "Campus",
  academic: "Academic",
  community: "Community",
  career: "Career",
  placements: "Placements",
  ai: "AI Tools",
  people: "People",
  organization: "Organization",
  insights: "Insights",
};

export interface AppSidebarProps {
  /**
   * Accepted as a direct prop rather than read internally from
   * AuthContext, so this component is testable in isolation by feeding
   * it any role (matching F7's own Definition of Done). F8 passes
   * `user.role` when assembling the real layouts.
   */
  role: UserRole;
  /**
   * Icon-only mode, added in F8 to make UIContext's sidebarCollapsed
   * state meaningful. Labels move to the `title` attribute (native
   * tooltip) plus an explicit aria-label, so collapsed mode stays
   * accessible without pulling in the Tooltip primitive for every item.
   */
  collapsed?: boolean;
  className?: string;
}

export function AppSidebar({ role, collapsed = false, className }: AppSidebarProps) {
  const items = getNavItemsForRole(role);

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1 p-3", className)}>
      {GROUP_ORDER.map((group, groupIndex) => {
        const groupItems = items.filter((item) => item.group === group);
        if (groupItems.length === 0) return null;

        const label = GROUP_LABELS[group];

        return (
          <div
            key={group}
            className={cn("flex flex-col gap-0.5", groupIndex > 0 && "mt-4")}
          >
            {label && !collapsed && (
              <p className="mb-1 px-3 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
                {label}
              </p>
            )}
            {groupItems.map((item) => {
              const Icon = resolveIcon(item.icon);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 font-body text-sm font-medium",
                      "transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary",
                          "transition-opacity duration-150",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/80 group-hover:text-foreground",
                        )}
                        aria-hidden="true"
                        strokeWidth={isActive ? 2.25 : 2}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
