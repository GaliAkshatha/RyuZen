import { NavLink, Outlet } from "react-router-dom";
import { Network, GraduationCap, Users, LogOut } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";

/**
 * Real Org Admin shell - deliberately only lists what's actually built
 * (Departments, Faculty, Students). Activities/Submissions/etc. are
 * real backend capabilities not yet built into this portal - not
 * padded out with placeholder nav items, matching the same honesty
 * principle already established in SuperAdminLayout.
 */
export function OrgAdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-foreground">RyuZen</p>
          <p className="text-xs text-muted-foreground">Institution Workspace</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Primary">
          <NavLink
            to="/organization/departments"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <Network className="h-4 w-4" aria-hidden="true" />
            Departments
          </NavLink>
          <NavLink
            to="/organization/faculty"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Faculty
          </NavLink>
          <NavLink
            to="/organization/students"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Students
          </NavLink>
        </nav>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Org Admin</p>
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
