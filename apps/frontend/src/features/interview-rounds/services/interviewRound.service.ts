import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  InterviewRoundResponseDto,
  ScheduleInterviewRoundPayload,
  RecordInterviewEvaluationPayload,
} from "@/features/interview-rounds/types/interviewRound.types";

export const interviewRoundService = {
  getForApplication(applicationId: string): Promise<InterviewRoundResponseDto[]> {
    return apiClient
      .get<InterviewRoundResponseDto[]>(
        `${API_ENDPOINTS.interviewRounds}/application/${applicationId}`,
      )
      .then((response) => response.data);
  },

  schedule(payload: ScheduleInterviewRoundPayload): Promise<InterviewRoundResponseDto> {
    return apiClient
      .post<InterviewRoundResponseDto>(API_ENDPOINTS.interviewRounds, payload)
      .then((response) => response.data);
  },

  recordEvaluation(
    id: string,
    payload: RecordInterviewEvaluationPayload,
  ): Promise<InterviewRoundResponseDto> {
    return apiClient
      .patch<InterviewRoundResponseDto>(`${API_ENDPOINTS.interviewRounds}/${id}/evaluate`, payload)
      .then((response) => response.data);
  },
};
