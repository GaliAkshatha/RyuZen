/** Matches the real backend ResumeResponseDto exactly. */
export const ResumeVisibility = { PRIVATE: "PRIVATE", PUBLIC: "PUBLIC" } as const;
export type ResumeVisibility = (typeof ResumeVisibility)[keyof typeof ResumeVisibility];

export interface Resume {
  userId: string;
  selectedTemplate?: string;
  resumeUrl?: string;
  lastGeneratedAt?: string;
  atsScore?: number;
  visibility: ResumeVisibility;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches the real backend ResumeTemplateResponseDto exactly. */
export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail?: string;
  templateFile?: string;
  premium: boolean;
}

/** Matches the real backend GenerateResumeSchema exactly - resumeUrl is a real link the student already has (e.g. a hosted file), not a file this endpoint produces. */
export interface GenerateResumeRequest {
  selectedTemplate: string;
  resumeUrl: string;
}

export interface UpdateResumeVisibilityRequest {
  visibility: ResumeVisibility;
}
