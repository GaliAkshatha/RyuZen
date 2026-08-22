/** Matches the real backend Mock Interview DTOs exactly. */
export const InterviewSessionStatus = { IN_PROGRESS: "IN_PROGRESS", COMPLETED: "COMPLETED" } as const;
export type InterviewSessionStatus = (typeof InterviewSessionStatus)[keyof typeof InterviewSessionStatus];

export interface InterviewExchange {
  question: string;
  answer?: string;
  askedAt: string;
  answeredAt?: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  role: string;
  exchanges: InterviewExchange[];
  status: InterviewSessionStatus;
  feedback?: string;
  score?: number;
  createdAt?: string;
}

export interface StartMockInterviewRequest {
  role: string;
}

export interface AnswerMockInterviewRequest {
  answer: string;
}
