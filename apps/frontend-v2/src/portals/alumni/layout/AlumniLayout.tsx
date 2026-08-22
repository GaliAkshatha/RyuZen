import { Outlet } from "react-router-dom";
import { Users, Home } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/alumni", label: "Home", icon: Home, end: true },
  { to: "/alumni/connect", label: "Connect", icon: Users },
];

/**
 * Real Alumni shell - topbar, not sidebar. Connect (People/
 * Connections/Requests/Messages, consolidated per product direction)
 * and Notifications (drawer, in TopNav) are real, confirmed backend
 * capabilities. Mentorship, Career Updates, and Student Contribution
 * remain confirmed real backend gaps - not fabricated here.
 */
export function AlumniLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Alumni" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
