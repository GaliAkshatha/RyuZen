import { UserRole } from "@/types/enums";

/**
 * Tracks every widget SLOT visible on every dashboard (not every
 * component — Hero/Announcements/AI-launcher are single shared
 * components reused across several dashboards, but each role's usage
 * of one is tracked as its own entry here, since that's what "is this
 * dashboard actually complete" means).
 *
 * H1 (Dashboard Widget Completion & Cross-Role QA) audited this list
 * against every widget built across Phases 2-10 and confirmed: every
 * registry entry maps 1:1 to a genuinely rendered widget on its
 * dashboard page, and no widget component's internal `wired` value
 * disagrees with its registry entry. The 3 `wired: false` entries
 * remaining (`student-attendance`, `faculty-student-progress`,
 * `alumni-mentorship`, each milestone-tagged with a trailing "*") are
 * not drift — they are permanent, well-documented backend gaps with no
 * scheduled milestone that could close them (see each widget's own
 * file comment for the specific missing backend capability). Zero
 * other `wired: false` entries exist.
 */
export interface DashboardWidgetEntry {
  id: string;
  label: string;
  dashboard: UserRole;
  wired: boolean;
  /** Which milestone wires this slot. "A4*" marks the one documented backend gap (see MentorshipOverviewWidget.tsx). */
  milestone?: string;
}

export const dashboardWidgetRegistry: DashboardWidgetEntry[] = [
  // --- Student ---
  { id: "student-hero", label: "Hero", dashboard: UserRole.STUDENT, wired: true },
  {
    id: "student-xp-points",
    label: "XP / Points",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-recent-activities",
    label: "Recent Activities",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-upcoming-events",
    label: "Upcoming Events",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-leaderboard-snippet",
    label: "Leaderboard",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-attendance",
    label: "Attendance",
    dashboard: UserRole.STUDENT,
    wired: false,
    milestone: "C3*",
  },
  { id: "student-ai-launcher", label: "AI Assistant", dashboard: UserRole.STUDENT, wired: true },
  {
    id: "student-announcements",
    label: "Announcements",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-career-score",
    label: "Career Score",
    dashboard: UserRole.STUDENT,
    wired: true,
  },
  {
    id: "student-my-applications",
    label: "My Applications",
    dashboard: UserRole.STUDENT,
    wired: true,
  },

  // --- Faculty ---
  { id: "faculty-hero", label: "Hero", dashboard: UserRole.FACULTY, wired: true },
  {
    id: "faculty-assigned-activities",
    label: "Assigned Activities",
    dashboard: UserRole.FACULTY,
    wired: true,
  },
  {
    id: "faculty-student-progress",
    label: "Student Progress",
    dashboard: UserRole.FACULTY,
    wired: false,
    milestone: "A4*",
  },
  {
    id: "faculty-pending-reviews",
    label: "Pending Reviews",
    dashboard: UserRole.FACULTY,
    wired: true,
  },
  {
    id: "faculty-attendance-summary",
    label: "Attendance Summary",
    dashboard: UserRole.FACULTY,
    wired: true,
  },
  {
    id: "faculty-announcements",
    label: "Announcements",
    dashboard: UserRole.FACULTY,
    wired: true,
  },

  // --- Alumni ---
  { id: "alumni-hero", label: "Hero", dashboard: UserRole.ALUMNI, wired: true },
  {
    id: "alumni-mentorship",
    label: "Mentorship",
    dashboard: UserRole.ALUMNI,
    wired: false,
    milestone: "A4*",
  },
  {
    id: "alumni-placements",
    label: "Placements",
    dashboard: UserRole.ALUMNI,
    wired: true,
  },
  {
    id: "alumni-announcements",
    label: "Announcements",
    dashboard: UserRole.ALUMNI,
    wired: true,
  },
  { id: "alumni-ai-launcher", label: "AI Assistant", dashboard: UserRole.ALUMNI, wired: true },

  // --- Organization Admin ---
  { id: "org-admin-hero", label: "Hero", dashboard: UserRole.ORG_ADMIN, wired: true },
  {
    id: "org-admin-analytics",
    label: "Analytics",
    dashboard: UserRole.ORG_ADMIN,
    wired: true,
  },
  {
    id: "org-admin-department-statistics",
    label: "Department Statistics",
    dashboard: UserRole.ORG_ADMIN,
    wired: true,
  },
  {
    id: "org-admin-user-management",
    label: "User Management",
    dashboard: UserRole.ORG_ADMIN,
    wired: true,
  },
  {
    id: "org-admin-activity-management",
    label: "Activities",
    dashboard: UserRole.ORG_ADMIN,
    wired: true,
  },
  {
    id: "org-admin-placements-overview",
    label: "Placements Overview",
    dashboard: UserRole.ORG_ADMIN,
    wired: true,
  },

  // --- Super Admin ---
  { id: "super-admin-hero", label: "Hero", dashboard: UserRole.SUPER_ADMIN, wired: true },
  {
    id: "super-admin-tenant-management",
    label: "Organizations",
    dashboard: UserRole.SUPER_ADMIN,
    wired: true,
  },
  {
    id: "super-admin-global-analytics",
    label: "Global Analytics",
    dashboard: UserRole.SUPER_ADMIN,
    wired: true,
  },
  {
    id: "super-admin-audit-logs",
    label: "Audit Logs",
    dashboard: UserRole.SUPER_ADMIN,
    wired: true,
  },
  {
    id: "super-admin-platform-health",
    label: "Platform Health",
    dashboard: UserRole.SUPER_ADMIN,
    wired: true,
  },
];

export function getWidgetsForDashboard(role: UserRole): DashboardWidgetEntry[] {
  return dashboardWidgetRegistry.filter((widget) => widget.dashboard === role);
}
