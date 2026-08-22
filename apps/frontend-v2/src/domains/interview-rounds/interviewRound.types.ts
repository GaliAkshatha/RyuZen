/** Matches the real backend InterviewRoundResponseDto exactly. */
export const InterviewRoundType = {
  ONLINE_ASSESSMENT: "ONLINE_ASSESSMENT",
  TECHNICAL_1: "TECHNICAL_1",
  TECHNICAL_2: "TECHNICAL_2",
  MANAGERIAL: "MANAGERIAL",
  HR: "HR",
} as const;
export type InterviewRoundType = (typeof InterviewRoundType)[keyof typeof InterviewRoundType];

export const InterviewRoundStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  PASSED: "PASSED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type InterviewRoundStatus = (typeof InterviewRoundStatus)[keyof typeof InterviewRoundStatus];

export interface InterviewRound {
  id: string;
  applicationId: string;
  roundType: InterviewRoundType;
  sequence: number;
  scheduledAt?: string;
  interviewerId?: string;
  status: InterviewRoundStatus;
  evaluation?: {
    rating?: number;
    strengths?: string;
    weaknesses?: string;
    notes?: string;
  };
  completedAt?: string;
  createdAt?: string;
}

/** Matches ScheduleInterviewRoundSchema exactly. */
export interface ScheduleInterviewRoundRequest {
  applicationId: string;
  roundType: InterviewRoundType;
  scheduledAt?: string;
  interviewerId?: string;
}

/** Matches RecordInterviewEvaluationSchema exactly - only `passed` is genuinely required. */
export interface RecordInterviewEvaluationRequest {
  passed: boolean;
  rating?: number;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}
