import { PlacementDriveStatus } from "@/types/enums";

/**
 * Mirrors PlacementDriveResponseDto exactly. Same pattern as Companies
 * (PL1): Browse (list/get) has no role restriction beyond
 * authentication. Create/Update/Publish/Close/Delete are ORG_ADMIN
 * ONLY, with SUPER_ADMIN explicitly excluded — stated outright in the
 * backend's own route-file comment, confirmed this milestone.
 * `companyId` is required on create but absent from the update
 * schema — a drive's company cannot be changed after creation.
 */
/**
 * Mirrors EligibilityCriteria exactly - the real, structured gate
 * GetEligibleStudentsUseCase and ApplyToPlacementUseCase both
 * evaluate against real Student records, not the free-text
 * `eligibility` field below (which stays as a human-readable
 * description). Every field optional; unset means no restriction on
 * that dimension. Deliberately has no backlog field - no real backlog
 * tracking exists anywhere in the Student domain, confirmed against
 * the backend directly.
 */
export interface EligibilityCriteria {
  departmentIds?: string[];
  minCgpa?: number;
  minSemester?: number;
  batches?: string[];
}

export interface PlacementDriveResponseDto {
  id: string;
  organizationId: string;
  companyId: string;
  title: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
  eligibilityCriteria?: EligibilityCriteria;
  deadline?: string;
  status: PlacementDriveStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreatePlacementDriveDto */
export interface CreatePlacementDrivePayload {
  companyId: string;
  title: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
  eligibilityCriteria?: EligibilityCriteria;
  deadline?: string;
}

/** Mirrors UpdatePlacementDriveDto — every field optional, no companyId */
export interface UpdatePlacementDrivePayload {
  title?: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
  eligibilityCriteria?: EligibilityCriteria;
  deadline?: string;
}
