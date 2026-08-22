import { Outlet } from "react-router-dom";
import { Network, GraduationCap, Users, Home, Mail, UserCheck, Settings, ScrollText, BarChart3 } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/organization", label: "Home", icon: Home, end: true },
  { to: "/organization/departments", label: "Departments", icon: Network },
  { to: "/organization/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/organization/students", label: "Students", icon: Users },
  { to: "/organization/invitations", label: "Invitations", icon: Mail },
  { to: "/organization/alumni", label: "Alumni", icon: UserCheck },
  { to: "/organization/settings", label: "Settings", icon: Settings },
  { to: "/organization/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/organization/placement-analytics", label: "Analytics", icon: BarChart3 },
];

/**
 * Real Org Admin shell - topbar, not sidebar. Departments, Faculty,
 * Students, Invitations, Alumni, Settings (all 18 real config
 * groups), Audit Logs, and Placement Analytics are all built.
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
