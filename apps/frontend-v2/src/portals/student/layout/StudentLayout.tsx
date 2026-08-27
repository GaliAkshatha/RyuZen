import { Outlet } from "react-router-dom";
import { Home, ClipboardList, Briefcase, FileText, TrendingUp, FolderKanban, Users, Sparkles, ScrollText } from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

const NAV_ITEMS: TopNavItem[] = [
  { to: "/student", label: "Home", icon: Home, end: true },
  { to: "/student/activities", label: "Activities", icon: ClipboardList },
  { to: "/student/drives", label: "Drives", icon: Briefcase },
  { to: "/student/applications", label: "Applications", icon: FileText },
  { to: "/student/career-score", label: "Career", icon: TrendingUp },
  { to: "/student/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/student/resume", label: "Resume", icon: ScrollText },
  { to: "/student/ai-assistant", label: "AI", icon: Sparkles },
  { to: "/student/connect", label: "Connect", icon: Users },
];

/**
 * Real Student shell - topbar, not sidebar (per product direction).
 * Placements, Career Score, Portfolio, Resume, AI Assistant, Connect,
 * and Notifications (drawer, in TopNav) are all real. Profile is
 * reached only via the avatar in TopNav, never a nav item. Resume was
 * previously a confirmed gap (a complete backend domain with zero
 * student-facing frontend) - now built and given its own nav entry,
 * matching how Career Score already gets its own dedicated space
 * despite also being portfolio-derived. Attendance and Assessments
 * remain real, substantial backend domains not yet re-verified and
 * built fresh in this rebuild.
 */
export function StudentLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopNav items={NAV_ITEMS} roleLabel="Student" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
