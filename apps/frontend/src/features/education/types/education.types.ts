/**
 * Mirrors EducationResponseDto exactly. Same pattern as Skills (CE1):
 * `userId` is the owning User.id directly, Create/List/Get/Update/
 * Delete have NO role restriction on the backend at all, and
 * Update/Delete enforce real per-record ownership server-side ("You
 * can only update your own education entries.", 403) — confirmed this
 * milestone. Unlike Skills, there is no Verify action anywhere on this
 * router at all.
 */
export interface EducationResponseDto {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  branch?: string;
  cgpa?: number;
  startYear: number;
  endYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateEducationDto */
export interface CreateEducationPayload {
  institution: string;
  degree: string;
  branch?: string;
  cgpa?: number;
  startYear: number;
  endYear?: number;
}

/** Mirrors UpdateEducationDto — every field optional */
export interface UpdateEducationPayload {
  institution?: string;
  degree?: string;
  branch?: string;
  cgpa?: number;
  startYear?: number;
  endYear?: number;
}
