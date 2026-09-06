/** Matches the real backend Mock Interview DTOs exactly. */
export const InterviewSessionStatus = { IN_PROGRESS: "IN_PROGRESS", COMPLETED: "COMPLETED", ABANDONED: "ABANDONED" } as const;
export type InterviewSessionStatus = (typeof InterviewSessionStatus)[keyof typeof InterviewSessionStatus];

export const InterviewDifficulty = { EASY: "EASY", MEDIUM: "MEDIUM", HARD: "HARD" } as const;
export type InterviewDifficulty = (typeof InterviewDifficulty)[keyof typeof InterviewDifficulty];

export interface InterviewExchange {
  question: string;
  difficulty: InterviewDifficulty;
  answer?: string;
  /** Real AI-assessed content quality (0-100) for this specific answer - not the overall session score. */
  qualityScore?: number;
  askedAt: string;
  answeredAt?: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  role: string;
  exchanges: InterviewExchange[];
  status: InterviewSessionStatus;
  durationMinutes: number;
  /** Derived server-side (durationMinutes / question count) - the real per-question time budget for the countdown. */
  perQuestionSeconds: number;
  feedback?: string;
  /** Real, separate lists from the backend's structured review - not folded into feedback. */
  strengths?: string[];
  improvements?: string[];
  score?: number;
  createdAt?: string;
}

/** Matches StartMockInterviewSchema exactly - durationMinutes is optional client-side (server defaults to 20 if omitted), bounded 5-60. */
export interface StartMockInterviewRequest {
  role: string;
  durationMinutes?: number;
}

export interface AnswerMockInterviewRequest {
  answer: string;
}

/**
 * A curated set of common placement-relevant roles, not a free-text
 * field - real interview prep benefits from picking a real target
 * role rather than typing an arbitrary string that might not map to
 * anything the AI has a strong grounding for.
 */
export const INTERVIEW_ROLE_OPTIONS = [
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "QA / Test Engineer",
  "Product Manager",
] as const;
