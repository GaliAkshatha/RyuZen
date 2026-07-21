import { ResumeVisibility } from "@/types/enums";

/**
 * Mirrors ResumeResponseDto exactly. No `id` field — this is a
 * singleton per user (one resume record, re-generated/overwritten each
 * time), unlike Certifications/Achievements which can have many
 * entries per person. Genuinely different from every other Career
 * module: GET/PATCH/generate/download are ALL self-scoped with no role
 * restriction, but critically there is NO "/users/:userId" or
 * "/students/:studentId" route anywhere on this router — admins and
 * faculty have no way to view another user's resume through this API
 * at all, confirmed this milestone.
 */
export interface ResumeResponseDto {
  userId: string;
  selectedTemplate?: string;
  resumeUrl?: string;
  lastGeneratedAt?: string;
  atsScore?: number;
  visibility: ResumeVisibility;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mirrors ResumeTemplateResponseDto exactly. Same "global catalog, no
 * organizationId" pattern as Badges (C5) — Create/Update/Delete are
 * SUPER_ADMIN-only, matching navRegistry's pre-existing
 * "/app/admin/resume-templates" entry.
 */
export interface ResumeTemplateResponseDto {
  id: string;
  name: string;
  thumbnail?: string;
  templateFile?: string;
  premium: boolean;
  createdAt?: string;
}

/**
 * Mirrors GenerateResumeDto. `resumeUrl` is required and client-
 * provided — confirmed this milestone this endpoint does not generate
 * a PDF server-side, it records a reference to a file URL the client
 * already has, same pattern as IssueCertificateDto (C5).
 */
export interface GenerateResumePayload {
  selectedTemplate: string;
  resumeUrl: string;
}

/** Mirrors UpdateResumeVisibilityDto */
export interface UpdateResumeVisibilityPayload {
  visibility: ResumeVisibility;
}

/** Mirrors CreateResumeTemplateDto */
export interface CreateResumeTemplatePayload {
  name: string;
  thumbnail?: string;
  templateFile?: string;
  premium?: boolean;
}

/** Mirrors UpdateResumeTemplateDto — every field optional */
export interface UpdateResumeTemplatePayload {
  name?: string;
  thumbnail?: string;
  templateFile?: string;
  premium?: boolean;
}
