import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  ApproveSubmissionPayload,
  CreateSubmissionPayload,
  RejectSubmissionPayload,
  ResubmitSubmissionPayload,
  SubmissionListFilters,
  SubmissionResponseDto,
} from "@/features/submissions/types/submission.types";

export const submissionService = {
  list(filters?: SubmissionListFilters): Promise<SubmissionResponseDto[]> {
    return apiClient
      .get<SubmissionResponseDto[]>(API_ENDPOINTS.submissions, { params: filters })
      .then((response) => response.data);
  },

  getById(id: string): Promise<SubmissionResponseDto> {
    return apiClient
      .get<SubmissionResponseDto>(`${API_ENDPOINTS.submissions}/${id}`)
      .then((response) => response.data);
  },

  submit(payload: CreateSubmissionPayload): Promise<SubmissionResponseDto> {
    return apiClient
      .post<SubmissionResponseDto>(API_ENDPOINTS.submissions, payload)
      .then((response) => response.data);
  },

  resubmit(id: string, payload: ResubmitSubmissionPayload): Promise<SubmissionResponseDto> {
    return apiClient
      .patch<SubmissionResponseDto>(`${API_ENDPOINTS.submissions}/${id}`, payload)
      .then((response) => response.data);
  },

  approve(id: string, payload: ApproveSubmissionPayload): Promise<SubmissionResponseDto> {
    return apiClient
      .patch<SubmissionResponseDto>(`${API_ENDPOINTS.submissions}/${id}/approve`, payload)
      .then((response) => response.data);
  },

  reject(id: string, payload: RejectSubmissionPayload): Promise<SubmissionResponseDto> {
    return apiClient
      .patch<SubmissionResponseDto>(`${API_ENDPOINTS.submissions}/${id}/reject`, payload)
      .then((response) => response.data);
  },
};
