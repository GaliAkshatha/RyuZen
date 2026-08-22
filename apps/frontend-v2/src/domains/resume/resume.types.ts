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
