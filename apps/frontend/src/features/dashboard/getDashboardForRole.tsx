import { lazy, type ComponentType } from "react";

import { UserRole } from "@/types/enums";

/**
 * Lazy per role (H4) — each dashboard eagerly imports several
 * feature-specific widgets, so splitting these means a Student never
 * downloads the Super Admin dashboard's widget code (and vice versa).
 * Already covered by the single <Suspense> boundary in router.tsx,
 * since DashboardRoleSwitch renders inside the routed tree.
 */
const StudentDashboardPage = lazy(() =>
  import("@/features/dashboard/pages/StudentDashboardPage").then((m) => ({
    default: m.StudentDashboardPage,
  })),
);
const FacultyDashboardPage = lazy(() =>
  import("@/features/dashboard/pages/FacultyDashboardPage").then((m) => ({
    default: m.FacultyDashboardPage,
  })),
);
const AlumniDashboardPage = lazy(() =>
  import("@/features/dashboard/pages/AlumniDashboardPage").then((m) => ({
    default: m.AlumniDashboardPage,
  })),
);
const OrganizationAdminDashboardPage = lazy(() =>
  import("@/features/dashboard/pages/OrganizationAdminDashboardPage").then((m) => ({
    default: m.OrganizationAdminDashboardPage,
  })),
);
const SuperAdminDashboardPage = lazy(() =>
  import("@/features/dashboard/pages/SuperAdminDashboardPage").then((m) => ({
    default: m.SuperAdminDashboardPage,
  })),
);

const DASHBOARD_BY_ROLE: Record<UserRole, ComponentType> = {
  [UserRole.STUDENT]: StudentDashboardPage,
  [UserRole.FACULTY]: FacultyDashboardPage,
  [UserRole.ALUMNI]: AlumniDashboardPage,
  [UserRole.ORG_ADMIN]: OrganizationAdminDashboardPage,
  [UserRole.SUPER_ADMIN]: SuperAdminDashboardPage,
};

export function getDashboardForRole(role: UserRole): ComponentType {
  return DASHBOARD_BY_ROLE[role];
}
