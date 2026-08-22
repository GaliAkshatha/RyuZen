import { NavLink, Outlet } from "react-router-dom";
import { ClipboardList, LogOut } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";

/**
 * Real Faculty shell - deliberately only lists what's actually built
 * (Activities, which now correctly includes real
 * organization+ownership isolation after this session's security
 * fix). Mentorship/Attendance/etc. are real backend capabilities not
 * yet built into this portal.
 */
export function FacultyLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-foreground">RyuZen</p>
          <p className="text-xs text-muted-foreground">Faculty Workspace</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Primary">
          <NavLink
            to="/faculty/activities"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            My Activities
          </NavLink>
        </nav>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Faculty</p>
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
