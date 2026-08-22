import { NavLink, Outlet } from "react-router-dom";
import { Briefcase, Building2, Users, Search, LogOut } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";

const NAV_ITEMS = [
  { to: "/recruiter/drives", label: "My Drives", icon: Briefcase },
  { to: "/recruiter/applicants", label: "Applicants", icon: Users },
  { to: "/recruiter/search", label: "Candidate Search", icon: Search },
  { to: "/recruiter/company", label: "My Company", icon: Building2 },
];

/**
 * Real Recruiter shell - all four sections are now real. "My Drives"
 * and "My Company" previously required GET /recruiters/me, a
 * confirmed backend gap - that self-lookup endpoint is now real
 * (mirrors the same pattern already proven for Faculty), so these are
 * genuinely correct rather than approximated from applicant data.
 */
export function RecruiterLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-foreground">RyuZen</p>
          <p className="text-xs text-muted-foreground">Recruiter</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Recruiter</p>
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
