import type { ComponentType } from "react";

import { UserRole } from "@/types/enums";
import { StudentDashboardPage } from "@/features/dashboard/pages/StudentDashboardPage";
import { FacultyDashboardPage } from "@/features/dashboard/pages/FacultyDashboardPage";
import { AlumniDashboardPage } from "@/features/dashboard/pages/AlumniDashboardPage";
import { OrganizationAdminDashboardPage } from "@/features/dashboard/pages/OrganizationAdminDashboardPage";
import { SuperAdminDashboardPage } from "@/features/dashboard/pages/SuperAdminDashboardPage";

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
