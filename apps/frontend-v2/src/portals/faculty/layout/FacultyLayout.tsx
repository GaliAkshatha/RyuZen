import { Outlet } from "react-router-dom";
import { ClipboardList, Home, Users, UserCheck, Calendar, ClipboardCheck, FileQuestion } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/faculty", label: "Home", icon: Home, end: true },
  { to: "/faculty/activities", label: "My Activities", icon: ClipboardList },
  { to: "/faculty/students", label: "My Students", icon: Users },
  { to: "/faculty/events", label: "Events", icon: Calendar },
  { to: "/faculty/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/faculty/assessments", label: "Assessments", icon: FileQuestion },
  { to: "/faculty/connect", label: "Connect", icon: UserCheck },
];

/**
 * Real Faculty shell - topbar, not sidebar. Activities (with real
 * organization+ownership isolation), My Students (real mentorship,
 * sourced from assigned mentees), Events (full lifecycle - create,
 * publish, mark attendance, issue certificates), Attendance (real
 * signed rotating QR-token sessions, GPS proximity, correction
 * review), Assessments (a full MCQ builder + timed student attempt
 * flow), and Connect are what's built. Every real, substantial
 * backend domain surfaced in the pre-deployment audit now has real
 * frontend coverage in this portal.
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
