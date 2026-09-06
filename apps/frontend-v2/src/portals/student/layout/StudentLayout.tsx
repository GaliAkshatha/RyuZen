import { Outlet } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Briefcase,
  FileText,
  TrendingUp,
  FolderKanban,
  Users,
  Sparkles,
  ScrollText,
  Calendar,
  ClipboardCheck,
  FileQuestion,
  Users2,
  GraduationCap,
  Layers,
} from "lucide-react";

import { TopNav, type TopNavItem } from "@/shared/layout/TopNav";

/**
 * Grouped into 3 dropdowns (Academics / Career / More) plus Home -
 * was 12 flat items before Clubs was even added, genuinely too wide
 * for a topbar. Grouping is purely presentational (TopNav's
 * `children` support) - every route below is completely unchanged,
 * this only changes how they're reached from the nav itself.
 */
const NAV_ITEMS: TopNavItem[] = [
  { to: "/student", label: "Home", icon: Home, end: true },
  {
    to: "",
    label: "Academics",
    icon: GraduationCap,
    children: [
      { to: "/student/activities", label: "Activities", icon: ClipboardList },
      { to: "/student/events", label: "Events", icon: Calendar },
      { to: "/student/clubs", label: "Clubs", icon: Users2 },
      { to: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
      { to: "/student/assessments", label: "Assessments", icon: FileQuestion },
    ],
  },
  {
    to: "",
    label: "Career",
    icon: Briefcase,
    children: [
      { to: "/student/drives", label: "Drives", icon: Briefcase },
      { to: "/student/applications", label: "Applications", icon: FileText },
      { to: "/student/career-score", label: "Career Score", icon: TrendingUp },
      { to: "/student/portfolio", label: "Portfolio", icon: FolderKanban },
      { to: "/student/resume", label: "Resume", icon: ScrollText },
    ],
  },
  {
    to: "",
    label: "More",
    icon: Layers,
    children: [
      { to: "/student/ai-assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/student/connect", label: "Connect", icon: Users },
    ],
  },
];

/**
 * Real Student shell - topbar, not sidebar (per product direction).
 * Every route from before is still reachable, just grouped rather
 * than flat - see NAV_ITEMS above for the real grouping. Profile is
 * reached only via the avatar in TopNav, never a nav item.
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
