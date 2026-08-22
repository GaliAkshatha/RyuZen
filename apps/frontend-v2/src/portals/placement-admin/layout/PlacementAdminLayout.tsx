import { Outlet } from "react-router-dom";
import { Building2, Briefcase, Home, BarChart3 } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/placement-admin", label: "Home", icon: Home, end: true },
  { to: "/placement-admin/companies", label: "Companies", icon: Building2 },
  { to: "/placement-admin/drives", label: "Drives", icon: Briefcase },
  { to: "/placement-admin/analytics", label: "Analytics", icon: BarChart3 },
];

/**
 * Real Placement Admin shell - topbar, not sidebar. Companies
 * (create/list) and Drives (create/publish/close, plus real
 * application review with status updates) and Analytics are what's
 * built. Recruiter account management is a confirmed backend gap
 * (POST /recruiters exists but no GET /recruiters list endpoint) -
 * not fabricated here.
 */
export function PlacementAdminLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Placement Admin" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
