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
export interface PlacementDriveResponseDto {
  id: string;
  organizationId: string;
  companyId: string;
  title: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
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
  deadline?: string;
}

/** Mirrors UpdatePlacementDriveDto — every field optional, no companyId */
export interface UpdatePlacementDrivePayload {
  title?: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
  deadline?: string;
}
