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

export type NavGroup =
  | "overview"
  | "campus"
  | "academic"
  | "community"
  | "career"
  | "placements"
  | "ai"
  | "people"
  | "organization"
  | "insights"
  | "account";

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

/**
 * Everyone except SUPER_ADMIN. Corrected scope: Super Admin's real
 * job is maintaining the platform itself - organizations, platform
 * users/security, audit - not campus life, AI tools, or placements
 * for any single organization. Confirmed a Super Admin account could
 * reach "My Education -> Add an Education Entry"-style campus tooling
 * before this fix, the same class of gap already closed for Faculty
 * in the career section.
 */
export const CAMPUS_ROLES: UserRole[] = [
  UserRole.ORG_ADMIN,
  UserRole.FACULTY,
  UserRole.STUDENT,
  UserRole.ALUMNI,
];

export const navRegistry: NavItem[] = [
  // --- account (rendered via topbar menu, not the main sidebar) ---
  { path: "/app/profile", label: "Profile", icon: "user", roles: ALL_ROLES, group: "account" },

  // --- overview ---
  {
    path: "/app/dashboard",
    label: "Dashboard",
    icon: "layout-dashboard",
    roles: ALL_ROLES,
    group: "overview",
  },

  // --- campus ---
  { path: "/app/clubs", label: "Clubs", icon: "users", roles: CAMPUS_ROLES, group: "campus" },
  { path: "/app/events", label: "Events", icon: "calendar", roles: CAMPUS_ROLES, group: "campus" },
  { path: "/app/badges", label: "Badges", icon: "award", roles: CAMPUS_ROLES, group: "campus" },
  {
    path: "/app/certificates",
    label: "Certificates",
    icon: "file-badge",
    roles: [UserRole.STUDENT], // route-verified: GET .../certificates "mine" is STUDENT-only
    group: "campus",
  },

  // --- academic ---
  // Consolidated: Activities, Submissions, Attendance, Assessments,
  // and Coding Practice all reach real pages via AcademicLayout's
  // role-aware tab strip, matching "all the assignments and related
  // falls in one." roles here match the widest real access among the
  // 5 (Activities/Submissions/Assessments) - AcademicLayout itself
  // only renders the Attendance/Coding Practice tabs for the roles
  // that actually have them.
  {
    path: "/app/activities",
    label: "Academic",
    icon: "graduation-cap",
    roles: CAMPUS_ROLES,
    group: "academic",
  },

  // --- community ---
  {
    path: "/app/leaderboard",
    label: "Leaderboard",
    icon: "trophy",
    roles: CAMPUS_ROLES,
    group: "community",
  },
  {
    path: "/app/point-history",
    label: "Point History",
    icon: "coins",
    roles: [UserRole.STUDENT],
    group: "community",
  },
  {
    path: "/app/mentorship",
    label: "Mentorship",
    icon: "graduation-cap",
    // route-verified: no STUDENT-accessible route exists (see correction #2 above)
    roles: [UserRole.ORG_ADMIN, UserRole.FACULTY],
    group: "community",
  },
  {
    path: "/app/notifications",
    label: "Notifications",
    icon: "bell",
    roles: CAMPUS_ROLES,
    group: "community",
  },
  {
    path: "/app/connect/people",
    label: "Connect",
    icon: "message-circle",
    // route-verified: SUPER_ADMIN explicitly excluded on chat.routes.ts -
    // Connect wraps real messaging (Chat) alongside the new People/
    // Requests/Connections tabs, same real role scope.
    roles: [UserRole.ORG_ADMIN, UserRole.FACULTY, UserRole.STUDENT, UserRole.ALUMNI],
    group: "community",
  },

  // --- career ---
  // roles corrected to [STUDENT] across this whole group - these are
  // student career-portfolio-building tools. Confirmed against a real
  // screenshot: a Faculty account could reach "My Education -> Add an
  // Education Entry" before this fix. The backend now enforces the
  // same restriction (see career/*/presentation/routes/*.routes.ts) -
  // this isn't just hiding the nav link, the routes actually reject
  // non-STUDENT roles now.
  {
    path: "/app/career/skills",
    label: "Skills",
    icon: "sparkles",
    roles: [UserRole.STUDENT],
    group: "career",
  },
  {
    path: "/app/career/projects",
    label: "Portfolio Projects",
    icon: "folder-kanban",
    roles: [UserRole.STUDENT],
    group: "career",
  },
  {
    path: "/app/career/experience",
    label: "Experience",
    icon: "briefcase",
    roles: [UserRole.STUDENT],
    group: "career",
  },
  {
    path: "/app/career/education",
    label: "Education",
    icon: "book-open",
    roles: [UserRole.STUDENT],
    group: "career",
  },
  {
    path: "/app/career/certifications",
    label: "Certifications",
    icon: "badge-check",
    roles: [UserRole.STUDENT],
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
    roles: [UserRole.STUDENT],
    group: "career",
  },
  {
    path: "/app/career/resume",
    label: "Resume",
    icon: "file-text",
    roles: [UserRole.STUDENT],
    group: "career",
  },

  // --- placements ---
  // Consolidated into one real hub entry - Companies/Drives/My
  // Applications are reached via PlacementsLayout's persistent tab
  // strip, matching the same pattern as the AI Tools hub above.
  {
    path: "/app/placements",
    label: "Placements",
    icon: "briefcase-business",
    roles: CAMPUS_ROLES,
    group: "placements",
  },

  // --- ai ---
  // Consolidated into one real hub entry - the 5 real tools
  // underneath are reached via the persistent tab strip on
  // AIToolsLayout, not 5 separate sidebar items.
  { path: "/app/ai", label: "AI Tools", icon: "sparkles", roles: CAMPUS_ROLES, group: "ai" },

  // --- insights ---
  {
    path: "/app/admin/dashboard",
    label: "Analytics",
    icon: "bar-chart-3",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "insights",
  },
  {
    path: "/app/admin/audit-logs",
    label: "Audit Logs",
    icon: "scroll-text",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "insights",
  },
  {
    path: "/app/admin/point-ledger",
    label: "Point Ledger",
    icon: "shield-check",
    roles: [UserRole.ORG_ADMIN, UserRole.FACULTY],
    group: "insights",
  },
  {
    path: "/app/admin/placement-analytics",
    label: "Placement Analytics",
    icon: "trending-up",
    roles: [UserRole.ORG_ADMIN, UserRole.PLACEMENT_ADMIN],
    // route-verified: ORG_ADMIN and PLACEMENT_ADMIN only, SUPER_ADMIN explicitly excluded
    group: "insights",
  },

  // --- people ---
  {
    path: "/app/admin/users",
    label: "Users & Permissions",
    icon: "user-cog",
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
    group: "people",
  },
  {
    path: "/app/admin/invitations",
    label: "Invitations",
    icon: "send",
    roles: [UserRole.ORG_ADMIN],
    group: "people",
  },
  {
    path: "/app/admin/bulk-import",
    label: "Bulk Import",
    icon: "upload",
    roles: [UserRole.ORG_ADMIN],
    group: "people",
  },
  {
    path: "/app/admin/faculty",
    label: "Faculty",
    icon: "user-round",
    roles: [UserRole.ORG_ADMIN],
    group: "people",
  },
  {
    path: "/app/admin/students",
    label: "Students",
    icon: "users-round",
    roles: [UserRole.ORG_ADMIN],
    group: "people",
  },
  {
    path: "/app/admin/alumni",
    label: "Alumni",
    icon: "graduation-cap",
    // route-verified: admin-only, no public directory route exists (see correction #1 above)
    roles: [UserRole.ORG_ADMIN],
    group: "people",
  },

  // --- organization ---
  {
    path: "/app/admin/organizations",
    label: "Organizations",
    icon: "building",
    roles: [UserRole.SUPER_ADMIN],
    group: "organization",
  },
  {
    path: "/app/admin/organization-settings",
    label: "Organization Settings",
    icon: "settings",
    // route-verified: ORG_ADMIN only, SUPER_ADMIN explicitly excluded
    roles: [UserRole.ORG_ADMIN],
    group: "organization",
  },
  {
    path: "/app/admin/departments",
    label: "Departments",
    icon: "network",
    roles: [UserRole.ORG_ADMIN],
    group: "organization",
  },
  {
    path: "/app/admin/resume-templates",
    label: "Resume Templates",
    icon: "layout-template",
    roles: [UserRole.SUPER_ADMIN],
    group: "organization",
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navRegistry.filter((item) => item.roles.includes(role));
}
