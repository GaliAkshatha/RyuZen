import { Outlet } from "react-router-dom";
import { Home, Building2, ScrollText, BarChart3 } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/platform", label: "Home", icon: Home, end: true },
  { to: "/platform/organizations", label: "Organizations", icon: Building2 },
  { to: "/platform/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/platform/analytics", label: "Analytics", icon: BarChart3 },
];

/**
 * Real Super Admin shell - topbar, not sidebar. Organizations, Audit
 * Logs, and Analytics (real, confirmed shared with ORG_ADMIN - shows
 * data for whatever organization the caller's own account is
 * associated with, not a true cross-platform aggregate, since no such
 * endpoint exists in the real backend) are what's built.
 */
export function SuperAdminLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Super Admin" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
