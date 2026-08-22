import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/cn";
import { resolveIcon } from "@/shared/constants/iconMap";
import type { NavItem, NavGroup } from "@/shared/constants/navRegistry";

export interface SidebarSection {
  group: NavGroup;
  label?: string;
  items: NavItem[];
}

/**
 * Genuinely shared infrastructure - takes real section data as a prop
 * rather than importing navRegistry or any role-specific list
 * directly. The same component will compose Faculty/Recruiter/Org
 * Admin sidebars in later phases without modification, matching the
 * architecture principle: role differentiation through composition
 * and data, not parallel sidebar implementations.
 *
 * Collapse is local UI state (not a business/workflow concern), so
 * useState here is correct per the rebuild's own URL-architecture
 * rule - collapse isn't navigation, it doesn't need to survive a
 * reload or be bookmarkable.
 */
export function SidebarV2({
  sections,
  collapsed,
  onToggleCollapsed,
  identity,
}: {
  sections: SidebarSection[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  identity?: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/40 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <span className="font-display text-lg font-bold text-primary">{collapsed ? "R" : "RyuZen"}</span>
      </div>

      {identity && !collapsed && <div className="border-b border-border px-4 py-3">{identity}</div>}

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2" aria-label="Primary">
        {sections.map((section, index) => (
          <div key={section.group} className={cn("flex flex-col gap-0.5", index > 0 && "mt-3")}>
            {section.label && !collapsed && (
              <p className="mb-1 px-3 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/app/dashboard"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex items-center justify-center gap-2 border-t border-border p-3 font-body text-xs text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && "Collapse"}
      </button>
    </aside>
  );
}
