import type {
  OrganizationStatus,
  OrganizationType,
  RegistrationMethod,
  SubscriptionPlan,
  UserRole,
  UserStatus,
} from "@/types/enums";

/**
 * Mirrors the Organization entity (IOrganization) exactly, returned
 * directly (not through a dedicated ResponseDto) by GetOrganization/
 * GetOrganizationsUseCase. Confirmed against organization.routes.ts:
 * EVERY action — Create/Get/GetAll/Update/UpdateStatus/CreateOrgAdmin
 * — is SUPER_ADMIN ONLY, with no ORG_ADMIN access at all. This is
 * platform-level tenant management, the inverse scope of the
 * "ORG_ADMIN-only, SUPER_ADMIN excluded" pattern seen throughout
 * Placements.
 *
 * `settings` here is a SIMPLE flat set of 11 feature-toggle booleans
 * embedded directly on the Organization entity — distinct from the
 * much richer, deeply-nested IOrganizationSettings model (17
 * categories: branding, security, academic, etc.) exposed by the
 * separate ORG_ADMIN-only /organizations/settings endpoint, out of
 * scope for this milestone (AD3).
 *
 * `registrationMethod`, `organizationType`, and `subscriptionPlan` are
 * NOT present in Create/UpdateOrganizationSchema — they're system-
 * managed fields, shown read-only rather than editable here.
 */
export interface OrganizationResponseDto {
  id: string;
  name: string;
  code: string;
  logo?: string;
  website?: string;
  emailDomains: string[];
  registrationMethod: RegistrationMethod;
  organizationType: OrganizationType;
  subscriptionPlan: SubscriptionPlan;
  status: OrganizationStatus;
  settings: OrganizationFlatSettings;
}

export interface OrganizationFlatSettings {
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
}

/** Mirrors CreateOrganizationDto */
export interface CreateOrganizationPayload {
  name: string;
  code: string;
  emailDomains: string[];
}

/** Mirrors UpdateOrganizationDto — every field optional, including a partial settings object */
export interface UpdateOrganizationPayload {
  name?: string;
  logo?: string;
  website?: string;
  emailDomains?: string[];
  settings?: Partial<OrganizationFlatSettings>;
}

/** Mirrors UpdateOrganizationStatusDto */
export interface UpdateOrganizationStatusPayload {
  status: OrganizationStatus;
}

/** Mirrors CreateOrgAdminDto — creates the first ORG_ADMIN user for an organization */
export interface CreateOrgAdminPayload {
  name: string;
  email: string;
  password: string;
}

/** Mirrors CreateOrgAdminResponseDto */
export interface CreateOrgAdminResponseDto {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
