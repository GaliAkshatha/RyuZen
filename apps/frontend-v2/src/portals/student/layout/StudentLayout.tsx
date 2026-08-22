import { NavLink, Outlet } from "react-router-dom";
import { Briefcase, FileText, TrendingUp, FolderKanban, Users, UserCheck, Inbox, Bell, LogOut } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";

const NAV_ITEMS = [
  { to: "/student/drives", label: "Placement Drives", icon: Briefcase },
  { to: "/student/applications", label: "My Applications", icon: FileText },
  { to: "/student/career-score", label: "Career Score", icon: TrendingUp },
  { to: "/student/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/student/people", label: "Find People", icon: Users },
  { to: "/student/connections", label: "My Connections", icon: UserCheck },
  { to: "/student/requests", label: "Requests", icon: Inbox },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
];

/**
 * Real Student shell. Placements (browse + apply), Career Score,
 * Portfolio (settings editable; the 6 aggregated sub-domains -
 * skills/projects/experience/education/certifications/achievements -
 * are read-only display here, since editing each is genuinely
 * separate, larger backend CRUD work not yet built fresh), and
 * Connections/Notifications (shared with Alumni) are what's built.
 * Resume, Attendance, Assessments, AI tools remain real, substantial
 * backend domains not yet re-verified and built fresh in this
 * rebuild - not padded out with placeholder nav items.
 */
export function StudentLayout() {
  const { user, logout } = useAuth();
  const { data: pendingRequests } = usePendingRequests();
  const pendingCount = pendingRequests?.length ?? 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-foreground">RyuZen</p>
          <p className="text-xs text-muted-foreground">Student</p>
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
              {item.to === "/student/requests" && pendingCount > 0 && (
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
            <p className="text-xs text-muted-foreground">Student</p>
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
