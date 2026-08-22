import { Outlet } from "react-router-dom";
import { Briefcase, Building2, Users, Search, Home } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/recruiter", label: "Home", icon: Home, end: true },
  { to: "/recruiter/drives", label: "My Drives", icon: Briefcase },
  { to: "/recruiter/applicants", label: "Applicants", icon: Users },
  { to: "/recruiter/search", label: "Search", icon: Search },
  { to: "/recruiter/company", label: "My Company", icon: Building2 },
];

/**
 * Real Recruiter shell - topbar, not sidebar. All four sections
 * (My Drives, Applicants, Candidate Search, My Company) are real,
 * confirmed scoped server-side to the recruiter's own real company.
 */
export function RecruiterLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Recruiter" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
