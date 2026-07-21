/**
 * API endpoint constants.
 *
 * `API_BASE_URL` is what `apiClient` is configured with (baseURL) — every
 * path below is relative to it, matching Axios's own baseURL + relative
 * path joining, so a service just does
 * `apiClient.get(API_ENDPOINTS.activities)`.
 *
 * Every path is copied verbatim from the backend's real `app.use(...)`
 * mounts in app.ts (grepped directly from the backend source during this
 * milestone, not reconstructed from memory). Feature milestones append
 * their own sub-paths (e.g. `${API_ENDPOINTS.activities}/${id}`) — this
 * file only owns the base paths, so it never needs to be touched again
 * once a feature starts building on top of it.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  auth: "/auth",
  users: "/users",
  organizations: "/organizations",
  /** Nested sub-router within organization.routes.ts, self-scoped to the caller's own org (no :id param). */
  organizationSettings: "/organizations/settings",
  activities: "/activities",
  submissions: "/submissions",
  auditLogs: "/audit-logs",
  departments: "/departments",
  faculty: "/faculty",
  students: "/students",
  alumni: "/alumni",
  mentorships: "/mentorships",
  clubs: "/clubs",
  events: "/events",
  leaderboard: "/leaderboard",
  badges: "/badges",
  certificates: "/certificates",
  skills: "/skills",
  projects: "/projects",
  experience: "/experience",
  education: "/education",
  certifications: "/certifications",
  achievements: "/achievements",
  portfolio: "/portfolio",
  resume: "/resume",
  companies: "/companies",
  /** Mounted at /api/v1/placements (not /drives) — confirmed via app.ts. */
  placementDrives: "/placements",
  placements: "/placements",
  applications: "/applications",
  placementAnalytics: "/placement-analytics",
  notifications: "/notifications",
  chats: "/chats",
  messages: "/messages",
  aiChat: "/ai/chat",
  aiResumeReview: "/ai/resume-review",
  aiCareerScore: "/ai/career-score",
  aiRecommendations: "/ai/recommendations",
  aiInterview: "/ai/interview",
  dashboard: "/dashboard",
} as const;
