import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AnswerMockInterviewPayload,
  MockInterviewSessionResponseDto,
  StartMockInterviewPayload,
} from "@/features/mock-interview/types/mockInterview.types";

export const mockInterviewService = {
  listMine(): Promise<MockInterviewSessionResponseDto[]> {
    return apiClient
      .get<MockInterviewSessionResponseDto[]>(API_ENDPOINTS.aiInterview)
      .then((response) => response.data);
  },

  getById(id: string): Promise<MockInterviewSessionResponseDto> {
    return apiClient
      .get<MockInterviewSessionResponseDto>(`${API_ENDPOINTS.aiInterview}/${id}`)
      .then((response) => response.data);
  },

  start(payload: StartMockInterviewPayload): Promise<MockInterviewSessionResponseDto> {
    return apiClient
      .post<MockInterviewSessionResponseDto>(API_ENDPOINTS.aiInterview, payload)
      .then((response) => response.data);
  },

  answer(
    id: string,
    payload: AnswerMockInterviewPayload,
  ): Promise<MockInterviewSessionResponseDto> {
    return apiClient
      .post<MockInterviewSessionResponseDto>(`${API_ENDPOINTS.aiInterview}/${id}/answer`, payload)
      .then((response) => response.data);
  },
};
