import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import { navRegistry } from "@/shared/constants/navRegistry";
import { UserRole } from "@/types/enums";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { RoleLayoutSwitch } from "@/routes/RoleLayoutSwitch";
import { DashboardRoleSwitch } from "@/routes/DashboardRoleSwitch";
import { RouteStubPage } from "@/routes/pages/RouteStubPage";
import { ForbiddenPage } from "@/routes/pages/ForbiddenPage";
import { NotFoundPage } from "@/routes/pages/NotFoundPage";
import { PlaygroundPage } from "@/routes/pages/PlaygroundPage";
import { CompositePlaygroundPage } from "@/routes/pages/CompositePlaygroundPage";

import { AuthLayout } from "@/layouts/AuthLayout";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { ChangePasswordPage } from "@/features/profile/pages/ChangePasswordPage";

import { DepartmentListPage } from "@/features/departments/pages/DepartmentListPage";
import { DepartmentDetailPage } from "@/features/departments/pages/DepartmentDetailPage";
import { FacultyListPage } from "@/features/faculty/pages/FacultyListPage";
import { FacultyDetailPage } from "@/features/faculty/pages/FacultyDetailPage";

import { StudentListPage } from "@/features/students/pages/StudentListPage";
import { StudentDetailPage } from "@/features/students/pages/StudentDetailPage";

import { AlumniListPage } from "@/features/alumni/pages/AlumniListPage";
import { AlumniDetailPage } from "@/features/alumni/pages/AlumniDetailPage";
import { InviteAlumniPage } from "@/features/alumni/pages/InviteAlumniPage";

import { MentorshipListPage } from "@/features/mentorship/pages/MentorshipListPage";
import { MentorshipDetailPage } from "@/features/mentorship/pages/MentorshipDetailPage";

import { ActivityListPage } from "@/features/activities/pages/ActivityListPage";
import { ActivityDetailPage } from "@/features/activities/pages/ActivityDetailPage";
import { CreateActivityPage } from "@/features/activities/pages/CreateActivityPage";

import { SubmissionListPage } from "@/features/submissions/pages/SubmissionListPage";
import { SubmissionDetailPage } from "@/features/submissions/pages/SubmissionDetailPage";

import { ClubListPage } from "@/features/clubs/pages/ClubListPage";
import { ClubDetailPage } from "@/features/clubs/pages/ClubDetailPage";
import { CreateClubPage } from "@/features/clubs/pages/CreateClubPage";

import { EventListPage } from "@/features/events/pages/EventListPage";
import { EventDetailPage } from "@/features/events/pages/EventDetailPage";
import { CreateEventPage } from "@/features/events/pages/CreateEventPage";

import { LeaderboardPage } from "@/features/leaderboard/pages/LeaderboardPage";
import { LeaderboardEntryDetailPage } from "@/features/leaderboard/pages/LeaderboardEntryDetailPage";

import { BadgeListPage } from "@/features/badges/pages/BadgeListPage";
import { BadgeDetailPage } from "@/features/badges/pages/BadgeDetailPage";
import { CreateBadgePage } from "@/features/badges/pages/CreateBadgePage";

import { MyCertificatesPage } from "@/features/certificates/pages/MyCertificatesPage";

import { SkillListPage } from "@/features/skills/pages/SkillListPage";
import { EducationListPage } from "@/features/education/pages/EducationListPage";
import { ExperienceListPage } from "@/features/experience/pages/ExperienceListPage";
import { CertificationListPage } from "@/features/certifications/pages/CertificationListPage";
import { AchievementListPage } from "@/features/achievements/pages/AchievementListPage";

import { MyResumePage } from "@/features/resume/pages/MyResumePage";
import { ResumeTemplateListPage } from "@/features/resume/pages/ResumeTemplateListPage";

import { MyPortfolioPage } from "@/features/portfolio/pages/MyPortfolioPage";

import { CompanyListPage } from "@/features/companies/pages/CompanyListPage";
import { CompanyDetailPage } from "@/features/companies/pages/CompanyDetailPage";
import { CreateCompanyPage } from "@/features/companies/pages/CreateCompanyPage";

import { PlacementDriveListPage } from "@/features/placement-drives/pages/PlacementDriveListPage";
import { PlacementDriveDetailPage } from "@/features/placement-drives/pages/PlacementDriveDetailPage";
import { CreatePlacementDrivePage } from "@/features/placement-drives/pages/CreatePlacementDrivePage";

import { MyApplicationsPage } from "@/features/job-applications/pages/MyApplicationsPage";

import { PlacementAnalyticsPage } from "@/features/placement-analytics/pages/PlacementAnalyticsPage";

/**
 * "/" redirects based on auth state, per the approved route tree.
 * Waits out isInitializing the same way ProtectedRoute does, to avoid
 * bouncing a returning user through /login before hydration finishes.
 */
function RootRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />;
}

/**
 * All detail-route stubs have now been replaced by real pages
 * (Clubs in C1, Events in C2) — this array is kept as the established
 * pattern for any future `:id` route that isn't a top-level nav
 * section, even though it's currently empty.
 */
const detailStubRoutes: { path: string; title: string }[] = [];

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes, wrapped in the real AuthLayout (F8), now with
          real forms (P1). */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

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
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}>
              <MentorshipListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/mentorship/:id"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}>
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
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.FACULTY]}>
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

        {detailStubRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<RouteStubPage title={title} />} />
        ))}
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
