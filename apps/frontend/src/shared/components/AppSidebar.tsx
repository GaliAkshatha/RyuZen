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
    <nav aria-label="Primary" className={cn("flex flex-col gap-6 p-4", className)}>
      {GROUP_ORDER.map((group) => {
        const groupItems = items.filter((item) => item.group === group);
        if (groupItems.length === 0) return null;

        const label = GROUP_LABELS[group];

        return (
          <div key={group} className="flex flex-col gap-1">
            {label && !collapsed && (
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
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm font-medium transition-all duration-200",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-gradient-to-r from-primary/15 to-transparent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-200",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                        aria-hidden="true"
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
