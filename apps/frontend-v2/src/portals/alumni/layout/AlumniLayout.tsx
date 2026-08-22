import { NavLink, Outlet } from "react-router-dom";
import { Users, UserCheck, Inbox, Bell, LogOut } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";

const NAV_ITEMS = [
  { to: "/alumni/people", label: "Find People", icon: Users },
  { to: "/alumni/connections", label: "My Connections", icon: UserCheck },
  { to: "/alumni/requests", label: "Requests", icon: Inbox },
  { to: "/alumni/notifications", label: "Notifications", icon: Bell },
];

/**
 * Real Alumni shell - deliberately only lists what's actually built
 * (Connections, Notifications), both real, confirmed backend
 * capabilities open to any authenticated user (org-admin/super-admin
 * exclusion enforced inside the use cases, not by role, so Alumni
 * genuinely participates in the same directory as everyone else).
 * Placements (browse), Mentorship, Career Updates, and Student
 * Contribution are NOT built here - Placements deserves a proper
 * shared cross-role build (Student needs the identical capability),
 * and the other three are confirmed real backend gaps from earlier
 * work on this backend (no Alumni-facing mentorship route, no
 * career-update or contribution domain exists at all) - not
 * fabricated here to make the nav look complete.
 */
export function AlumniLayout() {
  const { user, logout } = useAuth();
  const { data: pendingRequests } = usePendingRequests();
  const pendingCount = pendingRequests?.length ?? 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-foreground">RyuZen</p>
          <p className="text-xs text-muted-foreground">Alumni Network</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </span>
              {item.to === "/alumni/requests" && pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Alumni</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
