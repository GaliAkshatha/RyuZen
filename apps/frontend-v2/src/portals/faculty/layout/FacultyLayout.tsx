import { Outlet } from "react-router-dom";
import { ClipboardList, Home, Users, UserCheck } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/faculty", label: "Home", icon: Home, end: true },
  { to: "/faculty/activities", label: "My Activities", icon: ClipboardList },
  { to: "/faculty/students", label: "My Students", icon: Users },
  { to: "/faculty/connect", label: "Connect", icon: UserCheck },
];

/**
 * Real Faculty shell - topbar, not sidebar. Activities (with real
 * organization+ownership isolation), My Students (real mentorship,
 * sourced from assigned mentees), and Connect (a real, confirmed gap
 * fix this pass - Faculty was wrongly excluded before, but only
 * ORG_ADMIN/SUPER_ADMIN are actually excluded from the directory at
 * the backend level) are what's built. Attendance/Assessments remain
 * real backend capabilities not yet built into this portal.
 */
export function FacultyLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Faculty" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
