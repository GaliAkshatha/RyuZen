import type { ComponentType } from "react";

import { UserRole } from "@/types/enums";
import { StudentLayout } from "@/layouts/StudentLayout";
import { FacultyLayout } from "@/layouts/FacultyLayout";
import { AlumniLayout } from "@/layouts/AlumniLayout";
import { OrganizationAdminLayout } from "@/layouts/OrganizationAdminLayout";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";

const LAYOUT_BY_ROLE: Record<UserRole, ComponentType> = {
  [UserRole.STUDENT]: StudentLayout,
  [UserRole.FACULTY]: FacultyLayout,
  [UserRole.ALUMNI]: AlumniLayout,
  [UserRole.ORG_ADMIN]: OrganizationAdminLayout,
  [UserRole.SUPER_ADMIN]: SuperAdminLayout,
};

export function getLayoutForRole(role: UserRole): ComponentType {
  return LAYOUT_BY_ROLE[role];
}
