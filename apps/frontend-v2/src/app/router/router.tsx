import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/app/layouts/AppShell";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { RoleRoute } from "@/app/router/RoleRoute";
import { NotFoundPage } from "@/app/pages/NotFoundPage";
import { ForbiddenPage } from "@/app/pages/ForbiddenPage";
import { PortalRedirect } from "@/app/pages/PortalRedirect";
import { LoginPage } from "@/domains/auth/pages/LoginPage";

import { SuperAdminLayout } from "@/portals/super-admin/layout/SuperAdminLayout";
import { OrganizationListPage } from "@/portals/super-admin/pages/OrganizationListPage";
import { OrganizationDetailPage } from "@/portals/super-admin/pages/OrganizationDetailPage";
import { CreateOrganizationPage } from "@/portals/super-admin/pages/CreateOrganizationPage";

import { OrgAdminLayout } from "@/portals/org-admin/layout/OrgAdminLayout";
import { DepartmentListPage } from "@/portals/org-admin/pages/DepartmentListPage";
import { DepartmentDetailPage } from "@/portals/org-admin/pages/DepartmentDetailPage";
import { CreateDepartmentPage } from "@/portals/org-admin/pages/CreateDepartmentPage";
import { FacultyListPage } from "@/portals/org-admin/pages/FacultyListPage";
import { FacultyDetailPage } from "@/portals/org-admin/pages/FacultyDetailPage";
import { CreateFacultyPage } from "@/portals/org-admin/pages/CreateFacultyPage";
import { StudentListPage } from "@/portals/org-admin/pages/StudentListPage";
import { StudentDetailPage } from "@/portals/org-admin/pages/StudentDetailPage";
import { CreateStudentPage } from "@/portals/org-admin/pages/CreateStudentPage";

import { FacultyLayout } from "@/portals/faculty/layout/FacultyLayout";
import { ActivityListPage } from "@/portals/faculty/pages/ActivityListPage";
import { ActivityDetailPage } from "@/portals/faculty/pages/ActivityDetailPage";
import { CreateActivityPage } from "@/portals/faculty/pages/CreateActivityPage";

import { AlumniLayout } from "@/portals/alumni/layout/AlumniLayout";
import { PeoplePage } from "@/portals/alumni/pages/PeoplePage";
import { MyConnectionsPage } from "@/portals/alumni/pages/MyConnectionsPage";
import { RequestsPage } from "@/portals/alumni/pages/RequestsPage";
import { NotificationsPage } from "@/portals/alumni/pages/NotificationsPage";

import { StudentLayout } from "@/portals/student/layout/StudentLayout";
import { DriveListPage } from "@/portals/student/pages/DriveListPage";
import { DriveDetailPage } from "@/portals/student/pages/DriveDetailPage";
import { MyApplicationsPage } from "@/portals/student/pages/MyApplicationsPage";
import { CareerScorePage } from "@/portals/student/pages/CareerScorePage";
import { PortfolioPage } from "@/portals/student/pages/PortfolioPage";

import { PlacementAdminLayout } from "@/portals/placement-admin/layout/PlacementAdminLayout";
import { CompanyListPage } from "@/portals/placement-admin/pages/CompanyListPage";
import { CreateCompanyPage } from "@/portals/placement-admin/pages/CreateCompanyPage";
import { DriveListPage as PlacementAdminDriveListPage } from "@/portals/placement-admin/pages/DriveListPage";
import { DriveDetailPage as PlacementAdminDriveDetailPage } from "@/portals/placement-admin/pages/DriveDetailPage";
import { CreateDrivePage } from "@/portals/placement-admin/pages/CreateDrivePage";

import { RecruiterLayout } from "@/portals/recruiter/layout/RecruiterLayout";
import { ApplicantsPage } from "@/portals/recruiter/pages/ApplicantsPage";
import { CandidateSearchPage } from "@/portals/recruiter/pages/CandidateSearchPage";
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
      { index: true, element: <OrganizationListPage /> },
      { path: "organizations", element: <OrganizationListPage /> },
      { path: "organizations/new", element: <CreateOrganizationPage /> },
      { path: "organizations/:id", element: <OrganizationDetailPage /> },
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
      { index: true, element: <DepartmentListPage /> },
      { path: "departments", element: <DepartmentListPage /> },
      { path: "departments/new", element: <CreateDepartmentPage /> },
      { path: "departments/:id", element: <DepartmentDetailPage /> },
      { path: "faculty", element: <FacultyListPage /> },
      { path: "faculty/new", element: <CreateFacultyPage /> },
      { path: "faculty/:id", element: <FacultyDetailPage /> },
      { path: "students", element: <StudentListPage /> },
      { path: "students/new", element: <CreateStudentPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
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
      { index: true, element: <ActivityListPage /> },
      { path: "activities", element: <ActivityListPage /> },
      { path: "activities/new", element: <CreateActivityPage /> },
      { path: "activities/:id", element: <ActivityDetailPage /> },
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
      { index: true, element: <PeoplePage /> },
      { path: "people", element: <PeoplePage /> },
      { path: "connections", element: <MyConnectionsPage /> },
      { path: "requests", element: <RequestsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
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
      { index: true, element: <DriveListPage /> },
      { path: "drives", element: <DriveListPage /> },
      { path: "drives/:id", element: <DriveDetailPage /> },
      { path: "applications", element: <MyApplicationsPage /> },
      { path: "career-score", element: <CareerScorePage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "people", element: <PeoplePage /> },
      { path: "connections", element: <MyConnectionsPage /> },
      { path: "requests", element: <RequestsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
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
      { index: true, element: <CompanyListPage /> },
      { path: "companies", element: <CompanyListPage /> },
      { path: "companies/new", element: <CreateCompanyPage /> },
      { path: "drives", element: <PlacementAdminDriveListPage /> },
      { path: "drives/new", element: <CreateDrivePage /> },
      { path: "drives/:id", element: <PlacementAdminDriveDetailPage /> },
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
      { index: true, element: <MyDrivesPage /> },
      { path: "drives", element: <MyDrivesPage /> },
      { path: "applicants", element: <ApplicantsPage /> },
      { path: "search", element: <CandidateSearchPage /> },
      { path: "company", element: <MyCompanyPage /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <PortalRedirect /> }],
  },
  { path: "*", element: <NotFoundPage /> },
]);
