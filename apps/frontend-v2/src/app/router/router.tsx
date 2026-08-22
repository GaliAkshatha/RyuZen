import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { RoleRoute } from "@/app/router/RoleRoute";
import { NotFoundPage } from "@/app/pages/NotFoundPage";
import { ForbiddenPage } from "@/app/pages/ForbiddenPage";
import { LoginPage } from "@/domains/auth/pages/LoginPage";
import { LandingPage } from "@/app/pages/LandingPage";

import { SuperAdminLayout } from "@/portals/super-admin/layout/SuperAdminLayout";
import { SuperAdminHomePage } from "@/portals/super-admin/pages/SuperAdminHomePage";
import { OrganizationListPage } from "@/portals/super-admin/pages/OrganizationListPage";
import { OrganizationDetailPage } from "@/portals/super-admin/pages/OrganizationDetailPage";
import { CreateOrganizationPage } from "@/portals/super-admin/pages/CreateOrganizationPage";

import { OrgAdminLayout } from "@/portals/org-admin/layout/OrgAdminLayout";
import { OrgAdminHomePage } from "@/portals/org-admin/pages/OrgAdminHomePage";
import { DepartmentListPage } from "@/portals/org-admin/pages/DepartmentListPage";
import { DepartmentDetailPage } from "@/portals/org-admin/pages/DepartmentDetailPage";
import { CreateDepartmentPage } from "@/portals/org-admin/pages/CreateDepartmentPage";
import { FacultyListPage } from "@/portals/org-admin/pages/FacultyListPage";
import { FacultyDetailPage } from "@/portals/org-admin/pages/FacultyDetailPage";
import { CreateFacultyPage } from "@/portals/org-admin/pages/CreateFacultyPage";
import { StudentListPage } from "@/portals/org-admin/pages/StudentListPage";
import { StudentDetailPage } from "@/portals/org-admin/pages/StudentDetailPage";
import { CreateStudentPage } from "@/portals/org-admin/pages/CreateStudentPage";
import { BulkImportPage } from "@/portals/org-admin/pages/BulkImportPage";
import { InvitationsPage } from "@/portals/org-admin/pages/InvitationsPage";
import { AlumniListPage } from "@/portals/org-admin/pages/AlumniListPage";
import { AuditLogsPage } from "@/portals/org-admin/pages/AuditLogsPage";

import { FacultyLayout } from "@/portals/faculty/layout/FacultyLayout";
import { FacultyHomePage } from "@/portals/faculty/pages/FacultyHomePage";
import { MyStudentsPage } from "@/portals/faculty/pages/MyStudentsPage";
import { ActivityListPage } from "@/portals/faculty/pages/ActivityListPage";
import { ActivityDetailPage } from "@/portals/faculty/pages/ActivityDetailPage";
import { CreateActivityPage } from "@/portals/faculty/pages/CreateActivityPage";

import { AlumniLayout } from "@/portals/alumni/layout/AlumniLayout";
import { AlumniHomePage } from "@/portals/alumni/pages/AlumniHomePage";
import { ConnectPage } from "@/domains/connections/components/ConnectPage";
import { ProfilePage } from "@/domains/auth/pages/ProfilePage";
import { AIAssistantPage } from "@/portals/student/pages/AIAssistantPage";

import { StudentLayout } from "@/portals/student/layout/StudentLayout";
import { StudentHomePage } from "@/portals/student/pages/StudentHomePage";
import { StudentActivityListPage } from "@/portals/student/pages/StudentActivityListPage";
import { StudentActivityDetailPage } from "@/portals/student/pages/StudentActivityDetailPage";
import { DriveListPage } from "@/portals/student/pages/DriveListPage";
import { DriveDetailPage } from "@/portals/student/pages/DriveDetailPage";
import { MyApplicationsPage } from "@/portals/student/pages/MyApplicationsPage";
import { CareerScorePage } from "@/portals/student/pages/CareerScorePage";
import { PortfolioPage } from "@/portals/student/pages/PortfolioPage";

import { PlacementAdminLayout } from "@/portals/placement-admin/layout/PlacementAdminLayout";
import { PlacementAdminHomePage } from "@/portals/placement-admin/pages/PlacementAdminHomePage";
import { CompanyListPage } from "@/portals/placement-admin/pages/CompanyListPage";
import { PlacementAnalyticsPage } from "@/portals/placement-admin/pages/PlacementAnalyticsPage";
import { OrgAnalyticsPage } from "@/portals/org-admin/pages/OrgAnalyticsPage";
import { CreateCompanyPage } from "@/portals/placement-admin/pages/CreateCompanyPage";
import { DriveListPage as PlacementAdminDriveListPage } from "@/portals/placement-admin/pages/DriveListPage";
import { DriveDetailPage as PlacementAdminDriveDetailPage } from "@/portals/placement-admin/pages/DriveDetailPage";
import { CreateDrivePage } from "@/portals/placement-admin/pages/CreateDrivePage";

import { RecruiterLayout } from "@/portals/recruiter/layout/RecruiterLayout";
import { ApplicantsPage } from "@/portals/recruiter/pages/ApplicantsPage";
import { CandidateSearchPage } from "@/portals/recruiter/pages/CandidateSearchPage";
import { RecruiterHomePage } from "@/portals/recruiter/pages/RecruiterHomePage";
import { MyDrivesPage } from "@/portals/recruiter/pages/MyDrivesPage";
import { MyCompanyPage } from "@/portals/recruiter/pages/MyCompanyPage";

import { UserRole } from "@/shared/types/enums";

/**
 * Real portal replaces the shared placeholder role by role. Org Admin
 * is real now (Departments) - Placement Admin, despite historically
 * sharing a landing path with Org Admin in the Phase 1 placeholder
 * era, now has its own real path (see getPortalPathForRole's fix)
 * since it's a genuinely distinct role with different backend
 * authorization, not a variant of Org Admin.
 */
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/403", element: <ForbiddenPage /> },
  {
    path: "/platform",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
          <SuperAdminLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuperAdminHomePage /> },
      { path: "organizations", element: <OrganizationListPage /> },
      { path: "organizations/new", element: <CreateOrganizationPage /> },
      { path: "organizations/:id", element: <OrganizationDetailPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
    ],
  },
  {
    path: "/organization",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.ORG_ADMIN]}>
          <OrgAdminLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OrgAdminHomePage /> },
      { path: "departments", element: <DepartmentListPage /> },
      { path: "departments/new", element: <CreateDepartmentPage /> },
      { path: "departments/:id", element: <DepartmentDetailPage /> },
      { path: "faculty", element: <FacultyListPage /> },
      { path: "faculty/new", element: <CreateFacultyPage /> },
      { path: "faculty/:id", element: <FacultyDetailPage /> },
      { path: "students", element: <StudentListPage /> },
      { path: "students/new", element: <CreateStudentPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
      { path: "students/bulk-import", element: <BulkImportPage /> },
      { path: "invitations", element: <InvitationsPage /> },
      { path: "alumni", element: <AlumniListPage /> },
      { path: "placements", element: <PlacementAnalyticsPage /> },
      { path: "analytics", element: <OrgAnalyticsPage /> },
    ],
  },
  {
    path: "/faculty",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.FACULTY]}>
          <FacultyLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <FacultyHomePage /> },
      { path: "activities", element: <ActivityListPage /> },
      { path: "activities/new", element: <CreateActivityPage /> },
      { path: "activities/:id", element: <ActivityDetailPage /> },
      { path: "students", element: <MyStudentsPage /> },
      { path: "connect", element: <ConnectPage /> },
    ],
  },
  {
    path: "/alumni",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.ALUMNI]}>
          <AlumniLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AlumniHomePage /> },
      { path: "connect", element: <ConnectPage /> },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.STUDENT]}>
          <StudentLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentHomePage /> },
      { path: "drives", element: <DriveListPage /> },
      { path: "activities", element: <StudentActivityListPage /> },
      { path: "activities/:id", element: <StudentActivityDetailPage /> },
      { path: "drives/:id", element: <DriveDetailPage /> },
      { path: "applications", element: <MyApplicationsPage /> },
      { path: "career-score", element: <CareerScorePage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "connect", element: <ConnectPage /> },
      { path: "ai-assistant", element: <AIAssistantPage /> },
    ],
  },
  {
    path: "/placement-admin",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.PLACEMENT_ADMIN]}>
          <PlacementAdminLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PlacementAdminHomePage /> },
      { path: "companies", element: <CompanyListPage /> },
      { path: "companies/new", element: <CreateCompanyPage /> },
      { path: "drives", element: <PlacementAdminDriveListPage /> },
      { path: "drives/new", element: <CreateDrivePage /> },
      { path: "drives/:id", element: <PlacementAdminDriveDetailPage /> },
      { path: "analytics", element: <PlacementAnalyticsPage /> },
    ],
  },
  {
    path: "/recruiter",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[UserRole.RECRUITER]}>
          <RecruiterLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RecruiterHomePage /> },
      { path: "drives", element: <MyDrivesPage /> },
      { path: "applicants", element: <ApplicantsPage /> },
      { path: "search", element: <CandidateSearchPage /> },
      { path: "company", element: <MyCompanyPage /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  { path: "*", element: <NotFoundPage /> },
]);
