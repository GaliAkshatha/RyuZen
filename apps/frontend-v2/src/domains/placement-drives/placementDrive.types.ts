/**
 * Matches the real backend PlacementDriveResponseDto exactly -
 * confirmed directly against PlacementDriveResponseMapper.ts.
 * `eligibility` (free text) is real; `eligibilityCriteria`
 * (structured) is deliberately NOT included here - confirmed the
 * response mapper never returns it, despite the entity/create-request
 * having a structured field internally. This is the real, previously
 * flagged backend gap: no student-facing eligibility signal exists.
 * Do not add this field back without re-confirming the backend
 * actually returns it.
 */
export const PlacementDriveStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;
export type PlacementDriveStatus = (typeof PlacementDriveStatus)[keyof typeof PlacementDriveStatus];

/**
 * Matches the real backend PlacementDriveResponseDto exactly.
 * `eligibilityCriteria` was previously confirmed absent from every
 * response (silently stripped by the Zod schema even on create) -
 * that backend gap is now fixed (schema + response mapper both
 * updated), so this field is genuinely real and populated when a
 * drive has structured criteria set.
 */
export interface EligibilityCriteria {
  departmentIds?: string[];
  minCgpa?: number;
  minSemester?: number;
  batches?: string[];
}

export interface PlacementDrive {
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

/**
 * Matches CreatePlacementDriveSchema exactly. eligibilityCriteria was
 * previously silently stripped by the Zod schema (a confirmed backend
 * gap flagged earlier this engagement) - that's now fixed, so it's a
 * genuine, reachable field here.
 */
export interface CreatePlacementDriveRequest {
  companyId: string;
  title: string;
  description?: string;
  package?: string;
  location?: string;
  eligibility?: string;
  eligibilityCriteria?: EligibilityCriteria;
  deadline?: string;
}
