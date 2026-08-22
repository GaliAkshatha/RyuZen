import type { SidebarSection } from "@/app-shell/layout/SidebarV2";

/**
 * The real, verified Student IA - built directly from the accepted
 * Student implementation map, NOT derived from navRegistry (whose
 * grouping genuinely differs: "Learning" doesn't exist as a
 * navRegistry group, and "Career" here deliberately combines items
 * navRegistry splits across its separate "ai" and "career" groups).
 *
 * Every path below was individually confirmed against router.tsx
 * before being included - none are guessed or fabricated.
 *
 * One deliberate omission: "Interviews" as a Placements sub-item.
 * Interview visibility for a student is real (the read-only
 * InterviewRoundsPanel embedded in MyApplicationsPage, fixed and
 * tested this session), but there is no dedicated standalone
 * "Interviews" page/route to link to - only the expandable panel
 * inside Applications. Rather than fabricate a placeholder route,
 * this is left out and reported as a real gap instead.
 */
export const STUDENT_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    group: "overview",
    items: [{ path: "/app/dashboard", label: "Dashboard", icon: "layout-dashboard", roles: [], group: "overview" }],
  },
  {
    group: "growth",
    label: "Growth",
    items: [
      { path: "/app/growth", label: "Overview", icon: "trending-up", roles: [], group: "growth" },
      { path: "/app/growth/skills", label: "Skills", icon: "sparkles", roles: [], group: "growth" },
      { path: "/app/growth/projects", label: "Projects", icon: "folder-kanban", roles: [], group: "growth" },
      {
        path: "/app/growth/experience",
        label: "Experience & Education",
        icon: "briefcase",
        roles: [],
        group: "growth",
      },
      {
        path: "/app/growth/certifications",
        label: "Certifications",
        icon: "badge-check",
        roles: [],
        group: "growth",
      },
      { path: "/app/growth/achievements", label: "Achievements", icon: "medal", roles: [], group: "growth" },
    ],
  },
  {
    group: "academic",
    label: "Learning",
    items: [
      { path: "/app/activities", label: "Activities", icon: "clipboard-list", roles: [], group: "academic" },
      { path: "/app/submissions", label: "Submissions", icon: "file-check", roles: [], group: "academic" },
      { path: "/app/assessments", label: "Assessments", icon: "graduation-cap", roles: [], group: "academic" },
      { path: "/app/attendance/me", label: "Attendance", icon: "calendar-check", roles: [], group: "academic" },
      { path: "/app/coding-profiles", label: "Coding", icon: "book-open", roles: [], group: "academic" },
    ],
  },
  {
    group: "placements",
    label: "Placements",
    items: [
      { path: "/app/placements/drives", label: "Drives", icon: "briefcase-business", roles: [], group: "placements" },
      { path: "/app/placements/applications", label: "Applications", icon: "file-text", roles: [], group: "placements" },
    ],
  },
  {
    group: "ai",
    label: "Career",
    items: [
      { path: "/app/ai/career-score", label: "Career Score", icon: "gauge", roles: [], group: "ai" },
      { path: "/app/career/resume", label: "Resume", icon: "file-badge", roles: [], group: "ai" },
      { path: "/app/ai/recommendations", label: "Recommendations", icon: "compass", roles: [], group: "ai" },
      { path: "/app/ai/interview", label: "Mock Interview", icon: "mic", roles: [], group: "ai" },
      { path: "/app/ai/chat", label: "AI Assistant", icon: "bot", roles: [], group: "ai" },
    ],
  },
  {
    group: "community",
    label: "Community",
    items: [
      { path: "/app/connect/people", label: "Connections", icon: "users", roles: [], group: "community" },
      { path: "/app/chat", label: "Chat", icon: "message-circle", roles: [], group: "community" },
      { path: "/app/notifications", label: "Notifications", icon: "bell", roles: [], group: "community" },
    ],
  },
];
