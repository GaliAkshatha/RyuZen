import { Outlet } from "react-router-dom";
import { Home, Building2, ScrollText } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/platform", label: "Home", icon: Home, end: true },
  { to: "/platform/organizations", label: "Organizations", icon: Building2 },
  { to: "/platform/audit-logs", label: "Audit Logs", icon: ScrollText },
];

/**
 * Real Super Admin shell - topbar, not sidebar. Organizations and
 * Audit Logs (real, confirmed accessible to both SUPER_ADMIN and
 * ORG_ADMIN) are what's built. Not padded out with placeholder nav
 * items for Platform Health/Users/Analytics until those are real
 * pages - an empty-looking topbar that's honest is better than a full
 * one that lies about what's there.
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
