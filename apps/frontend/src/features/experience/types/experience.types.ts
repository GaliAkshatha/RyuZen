import { EmploymentType } from "@/types/enums";

/**
 * Mirrors ExperienceResponseDto exactly. Same pattern as Skills (CE1)
 * and Education (CE2): `userId` is the owning User.id directly,
 * Create/List/Get/Update/Delete have NO role restriction on the
 * backend at all, and Update/Delete enforce real per-record ownership
 * server-side ("You can only update your own experience entries.",
 * 403) — confirmed this milestone. No Verify action exists here
 * either. `skills` is a free-text string array (tags typed inline),
 * not linked to CE1's Skill catalog entity.
 */
export interface ExperienceResponseDto {
  id: string;
  userId: string;
  company: string;
  role: string;
  employmentType?: EmploymentType;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateExperienceDto */
export interface CreateExperiencePayload {
  company: string;
  role: string;
  employmentType?: EmploymentType;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  skills?: string[];
}

/** Mirrors UpdateExperienceDto — every field optional */
export interface UpdateExperiencePayload {
  company?: string;
  role?: string;
  employmentType?: EmploymentType;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  skills?: string[];
}
