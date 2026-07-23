import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Spinner } from "@/shared/components/Spinner";

import { useAuth } from "@/contexts/AuthContext";

import { navRegistry } from "@/shared/constants/navRegistry";
import { UserRole } from "@/types/enums";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { RoleLayoutSwitch } from "@/routes/RoleLayoutSwitch";
import { DashboardRoleSwitch } from "@/routes/DashboardRoleSwitch";
import { RouteStubPage } from "@/routes/pages/RouteStubPage";
import { ForbiddenPage } from "@/features/errors/pages/ForbiddenPage";
import { NotFoundPage } from "@/features/errors/pages/NotFoundPage";
import { ServerErrorPage } from "@/features/errors/pages/ServerErrorPage";


import { AuthLayout } from "@/layouts/AuthLayout";

/**
 * "/" redirects based on auth state, per the approved route tree.
 * Waits out isInitializing the same way ProtectedRoute does, to avoid
 * bouncing a returning user through /login before hydration finishes.
 */
function RootRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <LandingPage />;
}

/**
 * All detail-route stubs have now been replaced by real pages
 * (Clubs in C1, Events in C2) — this array is kept as the established
 * pattern for any future `:id` route that isn't a top-level nav
 * section, even though it's currently empty.
 */

const LandingPage = lazy(() =>
  import("@/features/landing/pages/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);

const detailStubRoutes: { path: string; title: string }[] = [];

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const ChangePasswordPage = lazy(() =>
  import("@/features/profile/pages/ChangePasswordPage").then((m) => ({
    default: m.ChangePasswordPage,
  })),
);
const DepartmentListPage = lazy(() =>
  import("@/features/departments/pages/DepartmentListPage").then((m) => ({
    default: m.DepartmentListPage,
  })),
);
const DepartmentDetailPage = lazy(() =>
  import("@/features/departments/pages/DepartmentDetailPage").then((m) => ({
    default: m.DepartmentDetailPage,
  })),
);
const FacultyListPage = lazy(() =>
  import("@/features/faculty/pages/FacultyListPage").then((m) => ({ default: m.FacultyListPage })),
);
const FacultyDetailPage = lazy(() =>
  import("@/features/faculty/pages/FacultyDetailPage").then((m) => ({
    default: m.FacultyDetailPage,
  })),
);
const StudentListPage = lazy(() =>
  import("@/features/students/pages/StudentListPage").then((m) => ({ default: m.StudentListPage })),
);
const StudentDetailPage = lazy(() =>
  import("@/features/students/pages/StudentDetailPage").then((m) => ({
    default: m.StudentDetailPage,
  })),
);
const AlumniListPage = lazy(() =>
  import("@/features/alumni/pages/AlumniListPage").then((m) => ({ default: m.AlumniListPage })),
);
const AlumniDetailPage = lazy(() =>
  import("@/features/alumni/pages/AlumniDetailPage").then((m) => ({ default: m.AlumniDetailPage })),
);
const InviteAlumniPage = lazy(() =>
  import("@/features/alumni/pages/InviteAlumniPage").then((m) => ({ default: m.InviteAlumniPage })),
);
const MentorshipListPage = lazy(() =>
  import("@/features/mentorship/pages/MentorshipListPage").then((m) => ({
    default: m.MentorshipListPage,
  })),
);
const MentorshipDetailPage = lazy(() =>
  import("@/features/mentorship/pages/MentorshipDetailPage").then((m) => ({
    default: m.MentorshipDetailPage,
  })),
);
const ActivityListPage = lazy(() =>
  import("@/features/activities/pages/ActivityListPage").then((m) => ({
    default: m.ActivityListPage,
  })),
);
const ActivityDetailPage = lazy(() =>
  import("@/features/activities/pages/ActivityDetailPage").then((m) => ({
    default: m.ActivityDetailPage,
  })),
);
const CreateActivityPage = lazy(() =>
  import("@/features/activities/pages/CreateActivityPage").then((m) => ({
    default: m.CreateActivityPage,
  })),
);
const SubmissionListPage = lazy(() =>
  import("@/features/submissions/pages/SubmissionListPage").then((m) => ({
    default: m.SubmissionListPage,
  })),
);
const SubmissionDetailPage = lazy(() =>
  import("@/features/submissions/pages/SubmissionDetailPage").then((m) => ({
    default: m.SubmissionDetailPage,
  })),
);
const ClubListPage = lazy(() =>
  import("@/features/clubs/pages/ClubListPage").then((m) => ({ default: m.ClubListPage })),
);
const ClubDetailPage = lazy(() =>
  import("@/features/clubs/pages/ClubDetailPage").then((m) => ({ default: m.ClubDetailPage })),
);
const CreateClubPage = lazy(() =>
  import("@/features/clubs/pages/CreateClubPage").then((m) => ({ default: m.CreateClubPage })),
);
const EventListPage = lazy(() =>
  import("@/features/events/pages/EventListPage").then((m) => ({ default: m.EventListPage })),
);
const EventDetailPage = lazy(() =>
  import("@/features/events/pages/EventDetailPage").then((m) => ({ default: m.EventDetailPage })),
);
const CreateEventPage = lazy(() =>
  import("@/features/events/pages/CreateEventPage").then((m) => ({ default: m.CreateEventPage })),
);
const LeaderboardPage = lazy(() =>
  import("@/features/leaderboard/pages/LeaderboardPage").then((m) => ({
    default: m.LeaderboardPage,
  })),
);
const LeaderboardEntryDetailPage = lazy(() =>
  import("@/features/leaderboard/pages/LeaderboardEntryDetailPage").then((m) => ({
    default: m.LeaderboardEntryDetailPage,
  })),
);
const BadgeListPage = lazy(() =>
  import("@/features/badges/pages/BadgeListPage").then((m) => ({ default: m.BadgeListPage })),
);
const BadgeDetailPage = lazy(() =>
  import("@/features/badges/pages/BadgeDetailPage").then((m) => ({ default: m.BadgeDetailPage })),
);
const CreateBadgePage = lazy(() =>
  import("@/features/badges/pages/CreateBadgePage").then((m) => ({ default: m.CreateBadgePage })),
);
const MyCertificatesPage = lazy(() =>
  import("@/features/certificates/pages/MyCertificatesPage").then((m) => ({
    default: m.MyCertificatesPage,
  })),
);
const SkillListPage = lazy(() =>
  import("@/features/skills/pages/SkillListPage").then((m) => ({ default: m.SkillListPage })),
);
const EducationListPage = lazy(() =>
  import("@/features/education/pages/EducationListPage").then((m) => ({
    default: m.EducationListPage,
  })),
);
const ExperienceListPage = lazy(() =>
  import("@/features/experience/pages/ExperienceListPage").then((m) => ({
    default: m.ExperienceListPage,
  })),
);
const CertificationListPage = lazy(() =>
  import("@/features/certifications/pages/CertificationListPage").then((m) => ({
    default: m.CertificationListPage,
  })),
);
const AchievementListPage = lazy(() =>
  import("@/features/achievements/pages/AchievementListPage").then((m) => ({
    default: m.AchievementListPage,
  })),
);
const MyResumePage = lazy(() =>
  import("@/features/resume/pages/MyResumePage").then((m) => ({ default: m.MyResumePage })),
);
const ResumeTemplateListPage = lazy(() =>
  import("@/features/resume/pages/ResumeTemplateListPage").then((m) => ({
    default: m.ResumeTemplateListPage,
  })),
);
const MyPortfolioPage = lazy(() =>
  import("@/features/portfolio/pages/MyPortfolioPage").then((m) => ({
    default: m.MyPortfolioPage,
  })),
);
const CompanyListPage = lazy(() =>
  import("@/features/companies/pages/CompanyListPage").then((m) => ({
    default: m.CompanyListPage,
  })),
);
const CompanyDetailPage = lazy(() =>
  import("@/features/companies/pages/CompanyDetailPage").then((m) => ({
    default: m.CompanyDetailPage,
  })),
);
const CreateCompanyPage = lazy(() =>
  import("@/features/companies/pages/CreateCompanyPage").then((m) => ({
    default: m.CreateCompanyPage,
  })),
);
const PlacementDriveListPage = lazy(() =>
  import("@/features/placement-drives/pages/PlacementDriveListPage").then((m) => ({
    default: m.PlacementDriveListPage,
  })),
);
const PlacementDriveDetailPage = lazy(() =>
  import("@/features/placement-drives/pages/PlacementDriveDetailPage").then((m) => ({
    default: m.PlacementDriveDetailPage,
  })),
);
const CreatePlacementDrivePage = lazy(() =>
  import("@/features/placement-drives/pages/CreatePlacementDrivePage").then((m) => ({
    default: m.CreatePlacementDrivePage,
  })),
);
const MyApplicationsPage = lazy(() =>
  import("@/features/job-applications/pages/MyApplicationsPage").then((m) => ({
    default: m.MyApplicationsPage,
  })),
);
const PlacementAnalyticsPage = lazy(() =>
  import("@/features/placement-analytics/pages/PlacementAnalyticsPage").then((m) => ({
    default: m.PlacementAnalyticsPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications/pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const ChatListPage = lazy(() =>
  import("@/features/chat/pages/ChatListPage").then((m) => ({ default: m.ChatListPage })),
);
const ChatDetailPage = lazy(() =>
  import("@/features/chat/pages/ChatDetailPage").then((m) => ({ default: m.ChatDetailPage })),
);
const AIChatPage = lazy(() =>
  import("@/features/ai-chat/pages/AIChatPage").then((m) => ({ default: m.AIChatPage })),
);
const ResumeReviewPage = lazy(() =>
  import("@/features/resume-review/pages/ResumeReviewPage").then((m) => ({
    default: m.ResumeReviewPage,
  })),
);
const CareerScorePage = lazy(() =>
  import("@/features/career-score/pages/CareerScorePage").then((m) => ({
    default: m.CareerScorePage,
  })),
);
const MockInterviewPage = lazy(() =>
  import("@/features/mock-interview/pages/MockInterviewPage").then((m) => ({
    default: m.MockInterviewPage,
  })),
);
const RecommendationsPage = lazy(() =>
  import("@/features/recommendations/pages/RecommendationsPage").then((m) => ({
    default: m.RecommendationsPage,
  })),
);
const UserPermissionsPage = lazy(() =>
  import("@/features/user-permissions/pages/UserPermissionsPage").then((m) => ({
    default: m.UserPermissionsPage,
  })),
);
const OrganizationListPage = lazy(() =>
  import("@/features/organizations/pages/OrganizationListPage").then((m) => ({
    default: m.OrganizationListPage,
  })),
);
const OrganizationDetailPage = lazy(() =>
  import("@/features/organizations/pages/OrganizationDetailPage").then((m) => ({
    default: m.OrganizationDetailPage,
  })),
);
const CreateOrganizationPage = lazy(() =>
  import("@/features/organizations/pages/CreateOrganizationPage").then((m) => ({
    default: m.CreateOrganizationPage,
  })),
);
const OrganizationSettingsPage = lazy(() =>
  import("@/features/organization-settings/pages/OrganizationSettingsPage").then((m) => ({
    default: m.OrganizationSettingsPage,
  })),
);
const AuditLogListPage = lazy(() =>
  import("@/features/audit-logs/pages/AuditLogListPage").then((m) => ({
    default: m.AuditLogListPage,
  })),
);
const AuditLogDetailPage = lazy(() =>
  import("@/features/audit-logs/pages/AuditLogDetailPage").then((m) => ({
    default: m.AuditLogDetailPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin-dashboard/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
/** Dev-only pages, lazy since CompositePlaygroundPage pulls in recharts — no reason for real users to ever download it. */
const PlaygroundPage = lazy(() =>
  import("@/routes/pages/PlaygroundPage").then((m) => ({ default: m.PlaygroundPage })),
);
const CompositePlaygroundPage = lazy(() =>
  import("@/routes/pages/CompositePlaygroundPage").then((m) => ({
    default: m.CompositePlaygroundPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Spinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Public routes, wrapped in the real AuthLayout (F8), now with
          real forms (P1). */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

        <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} /> 
  
        {/* Dev-only: verifies primitives/composites render correctly in
          both themes. Not linked from any nav, not auth-gated. */}
        <Route path="/dev/playground" element={<PlaygroundPage />} />
        <Route path="/dev/playground-composites" element={<CompositePlaygroundPage />} />

        {/* Every authenticated route: ProtectedRoute gates on auth,
          RoleLayoutSwitch (F8) picks the layout for the user's role,
          and every child route below is generated directly from
          navRegistry so the route tree and the sidebar can never
          disagree about who can access what. */}
        <Route
          element={
            <ProtectedRoute>
              <RoleLayoutSwitch />
            </ProtectedRoute>
          }
        >
          {navRegistry
            .filter(
              (item) =>
                ![
                  "/app/profile",
                  "/app/dashboard",
                  "/app/admin/departments",
                  "/app/admin/faculty",
                  "/app/admin/students",
                  "/app/admin/alumni",
                  "/app/mentorship",
                  "/app/activities",
                  "/app/submissions",
                  "/app/clubs",
                  "/app/events",
                  "/app/leaderboard",
                  "/app/badges",
                  "/app/certificates",
                  "/app/career/skills",
                  "/app/career/education",
                  "/app/career/experience",
                  "/app/career/certifications",
                  "/app/career/achievements",
                  "/app/career/resume",
                  "/app/admin/resume-templates",
                  "/app/career/portfolio",
                  "/app/placements/companies",
                  "/app/placements/drives",
                  "/app/placements/applications",
                  "/app/admin/placement-analytics",
                  "/app/notifications",
                  "/app/chat",
                  "/app/ai/chat",
                  "/app/ai/resume-review",
                  "/app/ai/career-score",
                  "/app/ai/interview",
                  "/app/ai/recommendations",
                  "/app/admin/users",
                  "/app/admin/organizations",
                  "/app/admin/organization-settings",
                  "/app/admin/audit-logs",
                  "/app/admin/dashboard",
                ].includes(item.path),
            )
            .map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <RoleRoute allowedRoles={item.roles}>
                    <RouteStubPage title={item.label} />
                  </RoleRoute>
                }
              />
            ))}

          {/* Real pages — /app/dashboard (D1) and /app/profile (P2) are
            both in navRegistry (all roles) but rendered explicitly
            here instead of through the generic stub map above. */}
          <Route path="/app/dashboard" element={<DashboardRoleSwitch />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/app/profile/change-password" element={<ChangePasswordPage />} />

          {/* Departments & Faculty (A1) — real pages, matching
            navRegistry's [SUPER_ADMIN, ORG_ADMIN] role list exactly. */}
          <Route
            path="/app/admin/departments"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <DepartmentListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/departments/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <DepartmentDetailPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/faculty"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <FacultyListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/faculty/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <FacultyDetailPage />
              </RoleRoute>
            }
          />

          {/* Students (A2) — real pages, [SUPER_ADMIN, ORG_ADMIN] only.
            The roadmap's own A2 text assumed Faculty read-access, but
            student.routes.ts is confirmed SUPER_ADMIN/ORG_ADMIN-only on
            every route including GET — the same finding F5 already
            made and encoded in navRegistry.ts. Followed backend truth
            here rather than the roadmap's assumption. */}
          <Route
            path="/app/admin/students"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <StudentListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/students/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <StudentDetailPage />
              </RoleRoute>
            }
          />

          {/* Alumni (A3) — real pages, [SUPER_ADMIN, ORG_ADMIN] only. The
            roadmap's own A3 text assumed a public/cross-role directory
            ("also read-visible under AlumniLayout/StudentLayout/
            FacultyLayout"), but alumni.routes.ts is confirmed
            SUPER_ADMIN/ORG_ADMIN-only on every route including GET —
            re-verified against the backend this milestone, the same
            finding F5 already made and encoded in navRegistry.ts. No
            "/app/alumni" browsing route exists, since no backend
            endpoint would back it. Verify itself is further restricted
            to ORG_ADMIN alone (excluding SUPER_ADMIN) inside
            VerifyAlumniAction.tsx, matching the one route-level
            asymmetry that genuinely exists. */}
          <Route
            path="/app/admin/alumni"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <AlumniListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/alumni/invite"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <InviteAlumniPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/alumni/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <AlumniDetailPage />
              </RoleRoute>
            }
          />

          {/* Mentorship (A4) — real pages, [SUPER_ADMIN, ORG_ADMIN,
            FACULTY] matching navRegistry exactly (re-verified this
            milestone: mentorship.routes.ts has no STUDENT-accessible
            route anywhere, and no POST endpoint at all — mentorships
            are created implicitly via Student's assign-mentor action,
            A2 — so there is no "/app/mentorship/new" route here). */}
          <Route
            path="/app/mentorship"
            element={
              <RoleRoute
                allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}
              >
                <MentorshipListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/mentorship/:id"
            element={
              <RoleRoute
                allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}
              >
                <MentorshipDetailPage />
              </RoleRoute>
            }
          />

          {/* Activities (AC1) — real pages. List/detail (browse) require
            only authentication on the backend (no role restriction),
            matching navRegistry's ALL_ROLES. Create is gated to
            [SUPER_ADMIN, FACULTY] — confirmed this milestone that
            ORG_ADMIN is explicitly EXCLUDED from activity management,
            unlike most other admin resources in this app (see
            activityPermissions.ts). Publish/Update/Close/Delete are
            gated inside ActivityDetailPage itself via
            canManageActivities(), not at the route level, since the
            detail page is genuinely viewable by everyone — only the
            management controls within it are conditionally shown. */}
          <Route path="/app/activities" element={<ActivityListPage />} />
          <Route path="/app/activities/:id" element={<ActivityDetailPage />} />
          <Route
            path="/app/activities/new"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.FACULTY]}>
                <CreateActivityPage />
              </RoleRoute>
            }
          />

          {/* Submissions (AC2) — real pages, open to all roles matching
            navRegistry and the backend (submission.routes.ts has no
            authorizeRoles/authorizePermission at all, confirmed this
            milestone — see submission.types.ts for the full finding).
            Review controls (Approve/Reject) are gated inside
            SubmissionDetailPage via canReviewSubmissions(), a
            client-side UX safeguard, not a route-level restriction. */}
          <Route path="/app/submissions" element={<SubmissionListPage />} />
          <Route path="/app/submissions/:id" element={<SubmissionDetailPage />} />

          {/* Clubs (C1) — real pages. List/detail (browse) require only
            authentication on the backend (no role restriction),
            matching navRegistry's ALL_ROLES. Create/Update/Delete/
            AssignAdvisor/AddMember/RemoveMember are ALL gated to
            [SUPER_ADMIN, ORG_ADMIN] — confirmed this milestone by
            grepping club.routes.ts. Significant finding: there is NO
            self-service "Join" endpoint anywhere on this router —
            POST /:id/members (adding a member) is admin-only, so
            membership is entirely admin-managed, not self-enrollment.
            The roadmap's "Browse, Join, Manage" framing for this
            milestone is corrected to "Browse, Manage" — see
            club.types.ts for the full finding. Management controls are
            gated inside ClubDetailPage itself via canManageClubs(),
            which genuinely mirrors this backend rule (not a UX-only
            safeguard like submissions'). */}
          <Route path="/app/clubs" element={<ClubListPage />} />
          <Route path="/app/clubs/:id" element={<ClubDetailPage />} />
          <Route
            path="/app/clubs/new"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <CreateClubPage />
              </RoleRoute>
            }
          />

          {/* Events (C2) — real pages. List/detail (browse) require only
            authentication on the backend (no role restriction),
            matching navRegistry's ALL_ROLES. Create/Update/Delete/
            Publish are gated to [SUPER_ADMIN, ORG_ADMIN, FACULTY] —
            confirmed this milestone. Registration (POST /:id/register)
            is a real, hard STUDENT-only backend rule (unlike
            Activities' open submission) — enforced inside
            RegisterForEventSection via canRegisterForEvents(). Note:
            GET /:id/registrations excludes STUDENT entirely, confirmed
            this milestone — a student has no backend-supported way to
            see their own past registrations; see
            RegisterForEventSection.tsx for the full finding. */}
          <Route path="/app/events" element={<EventListPage />} />
          <Route path="/app/events/:id" element={<EventDetailPage />} />
          <Route
            path="/app/events/new"
            element={
              <RoleRoute
                allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}
              >
                <CreateEventPage />
              </RoleRoute>
            }
          />

          {/* Leaderboard (C4) — real pages. GET / and GET /:studentId
            (browse) require only authentication on the backend (no role
            restriction), matching navRegistry's ALL_ROLES. Recalculate
            and Adjust Points are gated to [SUPER_ADMIN, ORG_ADMIN] —
            confirmed this milestone, enforced inside the components via
            canAdjustLeaderboard(). No create route: leaderboard entries
            are created implicitly, not via a POST endpoint. */}
          <Route path="/app/leaderboard" element={<LeaderboardPage />} />
          <Route path="/app/leaderboard/:studentId" element={<LeaderboardEntryDetailPage />} />

          {/* Badges (C5) — real pages. List/detail (browse) require only
            authentication (no role restriction), matching navRegistry's
            ALL_ROLES. Create/Update/Delete are SUPER_ADMIN ONLY —
            confirmed this milestone: badges are a global platform-wide
            catalog (no organizationId field), excluding even ORG_ADMIN,
            unlike almost every other admin resource in this app. Award
            is a broader [SUPER_ADMIN, ORG_ADMIN, FACULTY] permission,
            enforced inside BadgeDetailPage via canAwardBadges(). */}
          <Route path="/app/badges" element={<BadgeListPage />} />
          <Route path="/app/badges/:id" element={<BadgeDetailPage />} />
          <Route
            path="/app/badges/new"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <CreateBadgePage />
              </RoleRoute>
            }
          />

          {/* Certificates (C5) — GET /me is a genuine STUDENT-only
            self-service endpoint, matching navRegistry exactly. Issuing
            a certificate is embedded in StudentDetailPage (A2, admin-
            only) rather than a standalone route — see
            StudentCertificatesAndBadgesSection.tsx for the documented
            integration-scope limitation this creates for FACULTY. */}
          <Route
            path="/app/certificates"
            element={
              <RoleRoute allowedRoles={[UserRole.STUDENT]}>
                <MyCertificatesPage />
              </RoleRoute>
            }
          />

          {/* Skills (CE1) — real page, open to ALL_ROLES matching
            navRegistry. Confirmed this milestone: Create/List/Get/
            Update/Delete have NO role restriction on the backend at
            all (any authenticated user maintains their own skill
            list), but Update/Delete DO enforce real per-record
            ownership server-side ("You can only update your own
            skills.", 403) — see skill.types.ts. Verify is the one
            action gated to [SUPER_ADMIN, ORG_ADMIN, FACULTY], embedded
            in StudentDetailPage via StudentSkillsSection rather than a
            standalone route. */}
          <Route path="/app/career/skills" element={<SkillListPage />} />

          {/* Education (CE2) — real page, open to ALL_ROLES matching
            navRegistry. Same open-route/ownership-enforced pattern as
            Skills (CE1), confirmed this milestone, but with no Verify
            action at all — education.routes.ts has zero
            authorizePermission calls anywhere. */}
          <Route path="/app/career/education" element={<EducationListPage />} />

          {/* Experience (CE3) — real page, open to ALL_ROLES matching
            navRegistry. Same open-route/ownership-enforced pattern as
            Skills/Education, confirmed this milestone. `skills` on
            each entry is free-text tags, not linked to CE1's Skill
            catalog. */}
          <Route path="/app/career/experience" element={<ExperienceListPage />} />

          {/* Certifications (CE4) — real page, open to ALL_ROLES matching
            navRegistry. Same open-route/ownership-enforced pattern as
            Skills/Education/Experience, confirmed this milestone. */}
          <Route path="/app/career/certifications" element={<CertificationListPage />} />

          {/* Achievements (CE5) — real page. Genuinely different pattern
            from CE1-CE4: Submit/Update/Delete/GetMy are STUDENT-ONLY
            (not open to every role), confirmed this milestone and
            matching navRegistry's pre-existing [STUDENT] restriction
            (documented back in F5). Verify/Reject are gated to
            [SUPER_ADMIN, ORG_ADMIN, FACULTY], embedded in
            StudentDetailPage via StudentAchievementsSection. */}
          <Route
            path="/app/career/achievements"
            element={
              <RoleRoute allowedRoles={[UserRole.STUDENT]}>
                <AchievementListPage />
              </RoleRoute>
            }
          />

          {/* Resume (CE6) — real pages. GET/PATCH/generate/download are
            ALL self-scoped with no role restriction, matching
            navRegistry's "/app/career/resume" ALL_ROLES entry.
            Genuinely different from every other Career module:
            confirmed this milestone there is NO "/users/:userId" or
            "/students/:studentId" route anywhere — admins/faculty have
            no way to view another user's resume through this API at
            all, so no StudentResumeSection was built (unlike CE1-CE5).
            Templates (global catalog, SUPER_ADMIN-only) live at their
            own pre-existing "/app/admin/resume-templates" nav entry. */}
          <Route path="/app/career/resume" element={<MyResumePage />} />
          <Route
            path="/app/admin/resume-templates"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ResumeTemplateListPage />
              </RoleRoute>
            }
          />

          {/* Portfolio (CE7) — real page, open to ALL_ROLES matching
            navRegistry's "My Portfolio" entry. Combines settings
            (PATCH /portfolio/me) and individual project CRUD
            (mounted at /api/v1/projects, confirmed via app.ts — same
            open-route/ownership-enforced pattern as CE1-CE4) into one
            page, since GET /portfolio/me already returns the full
            aggregate (skills/projects/experience/education/
            certifications/achievements combined) — confirmed this
            milestone. No standalone public-portfolio-view page was
            built (GET /portfolio/:userId exists with a real visibility
            gate, but no nav entry was provisioned for browsing other
            users' portfolios). */}
          <Route path="/app/career/portfolio" element={<MyPortfolioPage />} />

          {/* Companies (PL1) — real pages. List/detail (browse) require
            only authentication on the backend (no role restriction),
            matching navRegistry's ALL_ROLES. Create/Update/UpdateStatus/
            Delete are ORG_ADMIN ONLY, with SUPER_ADMIN explicitly
            excluded — the backend's own route-file comment states this
            outright ("Per the Role & Permission Matrix, company
            management is ORG_ADMIN only"), confirmed this milestone.
            The inverse of almost every other admin resource in this
            app. Management controls are gated inside
            CompanyDetailPage via canManageCompanies(). */}
          <Route path="/app/placements/companies" element={<CompanyListPage />} />
          <Route path="/app/placements/companies/:id" element={<CompanyDetailPage />} />
          <Route
            path="/app/placements/companies/new"
            element={
              <RoleRoute allowedRoles={[UserRole.ORG_ADMIN]}>
                <CreateCompanyPage />
              </RoleRoute>
            }
          />

          {/* Placement Drives (PL2) — real pages, browse open to
            ALL_ROLES matching navRegistry. Same ORG_ADMIN-only
            (SUPER_ADMIN explicitly excluded) management pattern as
            Companies (PL1), confirmed this milestone. companyId is
            required on create but immutable after — no companyId field
            in UpdatePlacementDriveSchema. */}
          <Route path="/app/placements/drives" element={<PlacementDriveListPage />} />
          <Route path="/app/placements/drives/:id" element={<PlacementDriveDetailPage />} />
          <Route
            path="/app/placements/drives/new"
            element={
              <RoleRoute allowedRoles={[UserRole.ORG_ADMIN]}>
                <CreatePlacementDrivePage />
              </RoleRoute>
            }
          />

          {/* Job Applications (PL3) — real page. Applying and GET /me are
            both STUDENT-only, confirmed this milestone and matching
            navRegistry's pre-existing [STUDENT] restriction. Applying
            itself happens from PlacementDriveDetailPage via
            ApplyToPlacementSection; this page is purely "my
            applications" self-service. Reviewing applications for a
            drive is ORG_ADMIN-only, embedded in
            PlacementDriveDetailPage via JobApplicationReviewSection. */}
          <Route
            path="/app/placements/applications"
            element={
              <RoleRoute allowedRoles={[UserRole.STUDENT]}>
                <MyApplicationsPage />
              </RoleRoute>
            }
          />

          {/* Placement Analytics (PL4) — real page, single read-only
            endpoint. ORG_ADMIN-only, mounted at its own base path
            deliberately to avoid colliding with GET /placements/:id —
            confirmed this milestone, matching navRegistry's
            pre-existing "route-verified: ORG_ADMIN only, SUPER_ADMIN
            explicitly excluded" note. placementRate is already a
            rounded 0-100 percentage server-side, not a fraction. */}
          <Route
            path="/app/admin/placement-analytics"
            element={
              <RoleRoute allowedRoles={[UserRole.ORG_ADMIN]}>
                <PlacementAnalyticsPage />
              </RoleRoute>
            }
          />

          {/* Notifications (CM1) — real page, open to ALL_ROLES matching
            navRegistry. List and Mark Read are self-scoped with no
            role restriction. Send is ORG_ADMIN + FACULTY, SUPER_ADMIN
            explicitly excluded — confirmed this milestone, same
            recurring pattern as Placements (PL1-PL4). Notifications
            are broadcast records shared by everyone matching
            targetAudience, with isRead computed per-viewer from a
            readBy array — not a per-recipient copy. */}
          <Route path="/app/notifications" element={<NotificationsPage />} />

          {/* Chat (CM2) — real pages. Confirmed this milestone: SUPER_ADMIN
            is excluded from the ENTIRE feature (create/list/get/send/
            list-messages/mark-read), stated outright in the backend's
            own route comment ("Chat is available to every role except
            SUPER_ADMIN"), matching navRegistry's pre-existing note.
            GetChatUseCase enforces participant-only access (404, not
            403, to avoid revealing existence to non-participants).
            CreateChatUseCase is idempotent for DIRECT chats — reusing
            an existing chat between the same two users rather than
            duplicating. */}
          <Route
            path="/app/chat"
            element={
              <RoleRoute
                allowedRoles={[
                  UserRole.ORG_ADMIN,
                  UserRole.FACULTY,
                  UserRole.STUDENT,
                  UserRole.ALUMNI,
                ]}
              >
                <ChatListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/chat/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  UserRole.ORG_ADMIN,
                  UserRole.FACULTY,
                  UserRole.STUDENT,
                  UserRole.ALUMNI,
                ]}
              >
                <ChatDetailPage />
              </RoleRoute>
            }
          />

          {/* AI Chat (AI1) — real page, open to ALL_ROLES matching
            navRegistry, including SUPER_ADMIN (a rare exception to
            this app's recurring exclusion pattern). Confirmed this
            milestone: the backend's AI provider is StubAIProvider, a
            deterministic placeholder — "No live language-model
            credentials exist in this environment," per its own doc
            comment. The UI surfaces this honestly with a disclaimer
            rather than implying real intelligence. Omitting chatId on
            send starts a new session; providing one continues it. */}
          <Route path="/app/ai/chat" element={<AIChatPage />} />

          {/* Resume Review (AI2) — real page, open to ALL_ROLES matching
            navRegistry. Confirmed this milestone: unlike AI1's fully-
            placeholder reply, StubResumeReviewProvider's numeric score
            is a REAL deterministic completeness heuristic (the same
            logic GenerateResumeUseCase/CE6 uses) — only the
            strengths/improvements/summary TEXT is templated
            boilerplate. A successful review also updates the caller's
            CE6 Resume.atsScore server-side if one exists. */}
          <Route path="/app/ai/resume-review" element={<ResumeReviewPage />} />

          {/* Career Score (AI3) — real page, open to ALL_ROLES matching
            navRegistry. Confirmed this milestone: careerScore is a
            real deterministic average of 4 real sub-scores
            (Leaderboard, Resume ATS score, profile completeness,
            verified achievements) — same real-score/templated-
            narrative split as AI2. */}
          <Route path="/app/ai/career-score" element={<CareerScorePage />} />

          {/* Mock Interview (AI4) — real page, open to ALL_ROLES matching
            navRegistry. Confirmed this milestone: a session runs for
            exactly MAX_QUESTIONS = 5 exchanges before auto-completing
            with feedback + score. Same real-score/templated-feedback
            split as AI2/AI3 — the score is a real heuristic based on
            substantive-answer count, the feedback text is placeholder.
            Ownership enforced (404, obscuring existence). Answering an
            already-COMPLETED session is rejected (400). */}
          <Route path="/app/ai/interview" element={<MockInterviewPage />} />

          {/* Recommendations (AI5) — real page, open to ALL_ROLES matching
            navRegistry. The final AI Platform milestone. Confirmed this
            milestone: unlike AI2-AI4, there's no numeric score at all
            here — the CANDIDATES themselves (which Activities/Events/
            Clubs to suggest) are 100% real, genuinely filtered against
            the caller's own submissions/registrations/memberships (up
            to 5 per category). Only the per-item "reason" string is
            templated. Events/Clubs recommendations require the caller
            to resolve to a Student record; non-students silently get
            zero Events/Clubs suggestions (not an error). */}
          <Route path="/app/ai/recommendations" element={<RecommendationsPage />} />

          {/* Users & Permissions (AD1) — real page. Confirmed this
            milestone: Grant/Revoke Permission are SUPER_ADMIN +
            ORG_ADMIN, matching navRegistry's "/app/admin/users" entry.
            No generic cross-role user-search endpoint exists, so
            target users are entered by raw ID, same established
            precedent as NewChatForm (CM2). */}
          <Route
            path="/app/admin/users"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <UserPermissionsPage />
              </RoleRoute>
            }
          />

          {/* Organizations (AD2) — real pages. Confirmed against
            organization.routes.ts: EVERY action (Create/Get/GetAll/
            Update/UpdateStatus/CreateOrgAdmin) is SUPER_ADMIN ONLY,
            no ORG_ADMIN access at all — the inverse scope of
            Placements' ORG_ADMIN-only pattern, matching navRegistry's
            "/app/admin/organizations" entry exactly. */}
          <Route
            path="/app/admin/organizations"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <OrganizationListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/organizations/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <OrganizationDetailPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/organizations/new"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <CreateOrganizationPage />
              </RoleRoute>
            }
          />

          {/* Organization Settings (AD3) — real page. Confirmed against
            organization-settings.routes.ts: GET/PATCH are ORG_ADMIN-
            only (SUPER_ADMIN explicitly excluded, matching
            navRegistry's pre-existing note), self-scoped to the
            caller's own org, no :id param. GET auto-creates default
            settings if none exist yet — never a 404. A config-driven
            generic renderer handles all 18 categories / ~70 leaf
            fields rather than hand-written blocks. */}
          <Route
            path="/app/admin/organization-settings"
            element={
              <RoleRoute allowedRoles={[UserRole.ORG_ADMIN]}>
                <OrganizationSettingsPage />
              </RoleRoute>
            }
          />

          {/* Audit Logs (AD4) — real pages, read-only. Confirmed this
            milestone: both List and Get are SUPER_ADMIN + ORG_ADMIN,
            matching navRegistry. Always scoped by the caller's own
            organizationId — even SUPER_ADMIN does not get a cross-
            tenant platform-wide view here, genuinely different from
            AD2's Organizations. Single-record Get uses the same
            404-obscuring ownership convention seen elsewhere. */}
          <Route
            path="/app/admin/audit-logs"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <AuditLogListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/app/admin/audit-logs/:id"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <AuditLogDetailPage />
              </RoleRoute>
            }
          />

          {/* Dashboard (AD5) — real page, the final Administration
            milestone. Confirmed this milestone: SUPER_ADMIN + ORG_ADMIN
            only, matching navRegistry. Reuses PL4's exact
            PlacementAnalyticsResponseDto (confirmed against
            GetDashboardUseCase), and is org-scoped the same way as
            AD4's Audit Logs — no cross-tenant aggregate exists. The
            backend's own route comment notes FACULTY/STUDENT have only
            "Limited" access per the Role & Permission Matrix, and a
            reduced role-scoped view for them was explicitly not built
            in this milestone. */}
          <Route
            path="/app/admin/dashboard"
            element={
              <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />

          {detailStubRoutes.map(({ path, title }) => (
            <Route key={path} path={path} element={<RouteStubPage title={title} />} />
          ))}
        </Route>

        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
