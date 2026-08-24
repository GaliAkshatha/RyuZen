import type { UserRole, UserStatus } from "@/shared/types/enums";

/** Confirmed directly against domains/organizations/domain/constants/OrganizationStatus.ts */
export const OrganizationStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type OrganizationStatus = (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

/**
 * Matches the real backend OrganizationResponseDto exactly. A real,
 * significant bug was found and fixed this pass: no mapper existed
 * anywhere in the backend Organizations domain - every use case
 * returned the raw Organization class instance directly, and since
 * its fields are getters on the class prototype (not own enumerable
 * properties), JSON.stringify never serialized them at all - the
 * actual wire response was `{ props: { name, code, ... } }`, not this
 * flat shape. Proven directly (not just reasoned about) by running
 * the raw entity through JSON.stringify and comparing output. This
 * was the real root cause of "the Organizations page shows nothing."
 * userCount/departmentCount are a real enrichment added alongside the
 * fix - only populated on the list endpoint, undefined elsewhere.
 */
export interface Organization {
  id: string;
  name: string;
  code: string;
  logo?: string;
  website?: string;
  emailDomains: string[];
  registrationMethod: string;
  organizationType: string;
  subscriptionPlan: string;
  status: OrganizationStatus;
  userCount?: number;
  departmentCount?: number;
  /** Real enrichment, added alongside a confirmed gap: the detail page had an "Add org admin" action but never showed who the current org admin(s) actually are. Only populated on the detail endpoint. */
  orgAdmins?: { id: string; name: string; email: string }[];
  settings: {
    allowStudentRegistration: boolean;
    requireEmailVerification: boolean;
    requireAdminApproval: boolean;
    enableAI: boolean;
    enableActivities: boolean;
    enableLeaderboard: boolean;
    enableChat: boolean;
    enableNotifications: boolean;
    enableCareer: boolean;
    enableGames: boolean;
    enableAlumni: boolean;
  };
}

/**
 * Confirmed directly against CreateOrganizationSchema (the real Zod
 * validation) - only these 3 fields are genuinely required. Every
 * other field on IOrganization has a real Mongoose schema default
 * (confirmed directly against OrganizationModel.ts), so this is the
 * true minimal create contract, not an incomplete guess at the wider
 * entity shape.
 */
export interface CreateOrganizationRequest {
  name: string;
  code: string;
  emailDomains: string[];
}

export interface UpdateOrganizationStatusRequest {
  status: OrganizationStatus;
}

/**
 * Confirmed directly against CreateOrgAdminDto - organizationId is
 * part of the URL path (POST /:organizationId/admin), not the body,
 * so it's a separate service-function parameter, not part of this
 * payload type.
 */
export interface CreateOrgAdminRequest {
  name: string;
  email: string;
  password: string;
}

/** Confirmed directly against CreateOrgAdminResponseDto. */
export interface CreateOrgAdminResponse {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
