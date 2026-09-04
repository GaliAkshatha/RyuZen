import { Outlet } from "react-router-dom";
import { Network, GraduationCap, Users, Home, Mail, UserCheck, BarChart3, Briefcase, ShieldCheck, Users2 } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/organization", label: "Home", icon: Home, end: true },
  { to: "/organization/departments", label: "Departments", icon: Network },
  { to: "/organization/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/organization/students", label: "Students", icon: Users },
  { to: "/organization/invitations", label: "Invitations", icon: Mail },
  { to: "/organization/alumni", label: "Alumni", icon: UserCheck },
  { to: "/organization/clubs", label: "Clubs", icon: Users2 },
  { to: "/organization/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/organization/placements", label: "Placements", icon: Briefcase },
  { to: "/organization/ledger-audit", label: "Ledger Audit", icon: ShieldCheck },
];

/**
 * Real Org Admin shell - topbar, not sidebar. "Analytics" is
 * genuinely different from Placement Admin's view - real gap fixed
 * this pass: it previously pointed at the exact same narrow
 * placement-only page Placement Admin uses. It's now the org-wide
 * GET /dashboard aggregate (confirmed real, shared with SUPER_ADMIN)
 * - users, departments, activities, AI usage, department comparison -
 * with "Placements" kept as its own separate, clearly-labeled link
 * for the finer-grained drive-level detail Org Admin still has real
 * access to. Settings and (activity) Audit Logs are deliberately not
 * in this portal's nav, per explicit product direction - "Ledger
 * Audit" is a genuinely different feature (the point-transaction
 * hash-chain verification), not a renamed version of that excluded
 * page.
 */
export function OrgAdminLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Org Admin" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
