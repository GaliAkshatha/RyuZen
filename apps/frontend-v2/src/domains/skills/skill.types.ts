/** Matches the real backend SkillResponseDto exactly. */
export const SkillLevel = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const;
export type SkillLevel = (typeof SkillLevel)[keyof typeof SkillLevel];

export const SkillSource = {
  MANUAL: "MANUAL",
  AI_SUGGESTED: "AI_SUGGESTED",
} as const;
export type SkillSource = (typeof SkillSource)[keyof typeof SkillSource];

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category?: string;
  level?: SkillLevel;
  verified: boolean;
  source: SkillSource;
  /** Only set when source is AI_SUGGESTED. */
  confidence?: number;
  /** Only set when source is AI_SUGGESTED - a short real explanation of where this was inferred from. */
  evidence?: string;
  approved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches the real backend CreateSkillDto exactly. */
export interface CreateSkillRequest {
  name: string;
  category?: string;
  level?: SkillLevel;
}
