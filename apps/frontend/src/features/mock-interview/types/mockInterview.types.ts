import { InterviewSessionStatus } from "@/types/enums";

/**
 * Mirrors MockInterviewSessionResponseDto exactly. Open to every
 * authenticated role with no restriction. Ownership enforced (404
 * "Mock interview session not found." for a non-owner, same
 * obscuring convention as human/AI Chat). A session runs for exactly
 * MAX_QUESTIONS = 5 exchanges — confirmed this milestone by reading
 * AnswerMockInterviewUseCase directly — after which it auto-completes
 * with feedback + score. Answering an already-COMPLETED session is
 * rejected ("This interview session has already been completed.",
 * 400).
 *
 * Same real-score/templated-feedback split as AI2/AI3:
 * StubMockInterviewProvider's score is a REAL heuristic —
 * round((substantiveAnswers / totalAnswers) * 100), where
 * "substantive" means an answer of at least 20 characters — but the
 * feedback narrative text is placeholder boilerplate. Questions are
 * drawn from a small fixed 7-question pool cycled by index (not
 * genuinely role-specific), prefixed with "[role]".
 */
export interface MockInterviewSessionResponseDto {
  id: string;
  userId: string;
  role: string;
  exchanges: InterviewExchangeResponseDto[];
  status: InterviewSessionStatus;
  feedback?: string;
  score?: number;
  createdAt?: string;
}

/** Mirrors InterviewExchangeResponseDto exactly */
export interface InterviewExchangeResponseDto {
  question: string;
  answer?: string;
  askedAt: string;
  answeredAt?: string;
}

/** Mirrors StartMockInterviewDto */
export interface StartMockInterviewPayload {
  role: string;
}

/** Mirrors AnswerMockInterviewDto */
export interface AnswerMockInterviewPayload {
  answer: string;
}
