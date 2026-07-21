import { CompanyStatus } from "@/types/enums";

/**
 * Mirrors CompanyResponseDto exactly. Browse (list/get) has no role
 * restriction beyond authentication. Management (Create/Update/
 * UpdateStatus/Delete) is a genuinely new pattern for this app —
 * ORG_ADMIN ONLY, with SUPER_ADMIN explicitly EXCLUDED. This isn't an
 * inference: the backend's own route-file comment states it outright
 * ("Per the Role & Permission Matrix, company management is ORG_ADMIN
 * only (SUPER_ADMIN is explicitly excluded)"), confirmed this
 * milestone and matching navRegistry's pre-existing note.
 */
export interface CompanyResponseDto {
  id: string;
  organizationId: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
  status: CompanyStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateCompanyDto */
export interface CreateCompanyPayload {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
}

/** Mirrors UpdateCompanyDto — every field optional */
export interface UpdateCompanyPayload {
  name?: string;
  logo?: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
}

/** Mirrors UpdateCompanyStatusDto */
export interface UpdateCompanyStatusPayload {
  status: CompanyStatus;
}
