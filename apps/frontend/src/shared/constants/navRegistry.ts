import { UserRole } from "@/types/enums";

/**
 * Role-scoped navigation registry.
 *
 * Every `roles` array below was verified against the real backend route
 * files (grepped directly, not recalled from memory) — specifically,
 * against whichever GET/list endpoint determines if a role can access
 * that section AT ALL. Several entries correct assumptions made in the
 * approved implementation report before this milestone actually checked
 * the backend source; each correction is called out below rather than
 * silently applied, per this project's source-of-truth rules.
 *
 * CORRECTIONS vs. the approved roadmap:
 *
 * 1. Alumni: the roadmap assumed a public alumni directory browsable by
 *    Student/Faculty/Alumni. The real backend has NO such route — every
 *    route on alumni.routes.ts (including the list/detail GETs) is
 *    gated to SUPER_ADMIN/ORG_ADMIN only. This is admin-management-only
 *    in the current API surface; there is no student/alumni-facing
 *    directory endpoint to build against. Flagged for backend
 *    clarification if a public directory is actually wanted later.
 * 2. Mentorship: the roadmap assumed a Student-facing "My Mentor" page.
 *    The real backend's mentorship.routes.ts has exactly 5 routes (list,
 *    detail, assign, complete, cancel), ALL gated to
 *    SUPER_ADMIN/ORG_ADMIN/FACULTY — there is no STUDENT-accessible
 *    route anywhere on this router. A student currently has no way to
 *    fetch "who is my mentor" from this API. Flagged the same way.
 * 3. Certificates ("My Certificates"): gated to STUDENT only at the
 *    route level — Alumni cannot list their own certificates through
 *    this endpoint, even though they may have earned them as students.
 * 4. Achievements (submit / "my achievements"): STUDENT only — Alumni
 *    cannot submit or view their own achievements through this API.
 * 5. Event registration/feedback: STUDENT only — Alumni cannot register
 *    for events or leave feedback through this API.
 *
 * None of these five were "fixed" by inventing a broader role list —
 * the registry below reflects the backend exactly as implemented.
 */

export type NavGroup = "main" | "career" | "placements" | "ai" | "admin" | "account";

export interface NavItem {
  path: string;
  label: string;
  /** Semantic icon name only — mapped to a real icon component in F6/F8, not imported here to avoid pulling in an icon library before F6 formally introduces one. */
  icon: string;
  roles: UserRole[];
  group: NavGroup;
}

const ALL_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ORG_ADMIN,
  UserRole.FACULTY,
  UserRole.STUDENT,
  UserRole.ALUMNI,
];

export const navRegistry: NavItem[] = [
  // --- account (rendered via topbar menu, not the main sidebar) ---
  { path: "/app/profile", label: "Profile", icon: "user", roles: ALL_ROLES, group: "account" },

  // --- main ---
  {
    path: "/app/dashboard",
    label: "Dashboard",
    icon: "layout-dashboard",
    roles: ALL_ROLES,
    group: "main",
  },
  {
    path: "/app/activities",
    label: "Activities",
    icon: "clipboard-list",
    roles: ALL_ROLES,
    group: "main",
  },
  {
    path: "/app/submissions",
    label: "Submissions",
    icon: "file-check",
    roles: ALL_ROLES,
    group: "main",
  },
  { path: "/app/clubs", label: "Clubs", icon: "users", roles: ALL_ROLES, group: "main" },
  { path: "/app/events", label: "Events", icon: "calendar", roles: ALL_ROLES, group: "main" },
  {
    path: "/app/leaderboard",
    label: "Leaderboard",
    icon: "trophy",
    roles: ALL_ROLES,
    group: "main",
  },
  { path: "/app/badges", label: "Badges", icon: "award", roles: ALL_ROLES, group: "main" },
  {
    path: "/app/certificates",
    label: "Certificates",
    icon: "file-badge",
    roles: [UserRole.STUDENT], // route-verified: GET .../certificates "mine" is STUDENT-only
    group: "main",
  },
  {
    path: "/app/mentorship",
    label: "Mentorship",
    icon: "graduation-cap",
    // route-verified: no STUDENT-accessible route exists (see correction #2 above)
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY],
    group: "main",
  },
  {
    path: "/app/notifications",
    label: "Notifications",
    icon: "bell",
    roles: ALL_ROLES,
    group: "main",
  },
  {
    path: "/app/chat",
    label: "Chat",
    icon: "message-circle",
    // route-verified: SUPER_ADMIN explicitly excluded on chat.routes.ts
    roles: [UserRole.ORG_ADMIN, UserRole.FACULTY, UserRole.STUDENT, UserRole.ALUMNI],
    group: "main",
  },

  // --- career ---
  {
    path: "/app/career/skills",
    label: "Skills",
    icon: "sparkles",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/projects",
    label: "Portfolio Projects",
    icon: "folder-kanban",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/experience",
    label: "Experience",
    icon: "briefcase",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/education",
    label: "Education",
    icon: "book-open",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/certifications",
    label: "Certifications",
    icon: "badge-check",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/achievements",
    label: "Achievements",
    icon: "medal",
    roles: [UserRole.STUDENT], // route-verified: submit + "mine" are STUDENT-only
    group: "career",
  },
  {
    path: "/app/career/portfolio",
    label: "My Portfolio",
    icon: "user-square",
    roles: ALL_ROLES,
    group: "career",
  },
  {
    path: "/app/career/resume",
    label: "Resume",
    icon: "file-text",
    roles: ALL_ROLES,
    group: "career",
  },

  // --- placements ---
  {
    path: "/app/placements/companies",
    label: "Companies",
    icon: "building-2",
    roles: ALL_ROLES, // route-verified: browse GETs are open to all; manage is ORG_ADMIN-only (enforced in-page, not nav-level)
    group: "placements",
  },
  {
    path: "/app/placements/drives",
    label: "Placement Drives",
    icon: "briefcase-business",
    roles: ALL_ROLES,
    group: "placements",
  },
  {
    path: "/app/placements/applications",
    label: "My Applications",
    icon: "send",
    roles: [UserRole.STUDENT], // route-verified: apply + "mine" are STUDENT-only
    group: "placements",
  },

  // --- ai ---
  { path: "/app/ai/chat", label: "AI Chat", icon: "bot", roles: ALL_ROLES, group: "ai" },
  {
    path: "/app/ai/resume-review",
    label: "Resume Review",
    icon: "file-search",
    roles: ALL_ROLES,
    group: "ai",
  },
  {
    path: "/app/ai/career-score",
    label: "Career Score",
    icon: "gauge",
    roles: ALL_ROLES,
    group: "ai",
  },
  {
    path: "/app/ai/recommendations",
    label: "Recommendations",
    icon: "compass",
    roles: ALL_ROLES,
    group: "ai",
  },
  {
    path: "/app/ai/interview",
    label: "Mock Interview",
    icon: "mic",
    roles: ALL_ROLES,
    group: "ai",
  },

  // --- admin ---
  {
    path: "/app/admin/dashboard",
    label: "Analytics",
    icon: "bar-chart-3",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/users",
    label: "Users & Permissions",
    icon: "user-cog",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/organizations",
    label: "Organizations",
    icon: "building",
    roles: [UserRole.SUPER_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/organization-settings",
    label: "Organization Settings",
    icon: "settings",
    // route-verified: ORG_ADMIN only, SUPER_ADMIN explicitly excluded
    roles: [UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/audit-logs",
    label: "Audit Logs",
    icon: "scroll-text",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/departments",
    label: "Departments",
    icon: "network",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/faculty",
    label: "Faculty",
    icon: "user-round",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/students",
    label: "Students",
    icon: "users-round",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/alumni",
    label: "Alumni",
    icon: "graduation-cap",
    // route-verified: admin-only, no public directory route exists (see correction #1 above)
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/placement-analytics",
    label: "Placement Analytics",
    icon: "trending-up",
    // route-verified: ORG_ADMIN only, SUPER_ADMIN explicitly excluded
    roles: [UserRole.ORG_ADMIN],
    group: "admin",
  },
  {
    path: "/app/admin/resume-templates",
    label: "Resume Templates",
    icon: "layout-template",
    roles: [UserRole.SUPER_ADMIN],
    group: "admin",
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navRegistry.filter((item) => item.roles.includes(role));
}
