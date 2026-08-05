import { InterviewRoundType, InterviewRoundStatus } from "@/types/enums";

export interface InterviewRoundEvaluation {
  rating?: number;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}

/**
 * Mirrors InterviewRoundResponseDto exactly. Sequence is computed
 * server-side from how many real rounds already exist for this
 * application (ScheduleInterviewRoundUseCase) - never guessed
 * client-side, since a drive might skip a round entirely.
 */
export interface InterviewRoundResponseDto {
  id: string;
  applicationId: string;
  roundType: InterviewRoundType;
  sequence: number;
  scheduledAt?: string;
  interviewerId?: string;
  status: InterviewRoundStatus;
  evaluation?: InterviewRoundEvaluation;
  completedAt?: string;
  createdAt?: string;
}

/** Mirrors ScheduleInterviewRoundDto */
export interface ScheduleInterviewRoundPayload {
  applicationId: string;
  roundType: InterviewRoundType;
  scheduledAt?: string;
  interviewerId?: string;
}

/** Mirrors RecordInterviewEvaluationDto */
export interface RecordInterviewEvaluationPayload {
  passed: boolean;
  rating?: number;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}
