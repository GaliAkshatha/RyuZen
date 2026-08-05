import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AssessmentResponseDto,
  CreateAssessmentPayload,
  AssessmentQuestionResponseDto,
  StudentAssessmentQuestionResponseDto,
  AddAssessmentQuestionPayload,
  AssessmentAttemptResponseDto,
  RecordAssessmentAnswerPayload,
} from "@/features/assessments/types/assessment.types";

export const assessmentService = {
  list(): Promise<AssessmentResponseDto[]> {
    return apiClient
      .get<AssessmentResponseDto[]>(API_ENDPOINTS.assessments)
      .then((response) => response.data);
  },

  create(payload: CreateAssessmentPayload): Promise<AssessmentResponseDto> {
    return apiClient
      .post<AssessmentResponseDto>(API_ENDPOINTS.assessments, payload)
      .then((response) => response.data);
  },

  addQuestion(
    assessmentId: string,
    payload: AddAssessmentQuestionPayload,
  ): Promise<AssessmentQuestionResponseDto> {
    return apiClient
      .post<AssessmentQuestionResponseDto>(
        `${API_ENDPOINTS.assessments}/${assessmentId}/questions`,
        payload,
      )
      .then((response) => response.data);
  },

  publish(assessmentId: string): Promise<AssessmentResponseDto> {
    return apiClient
      .patch<AssessmentResponseDto>(`${API_ENDPOINTS.assessments}/${assessmentId}/publish`, {})
      .then((response) => response.data);
  },

  getResults(assessmentId: string): Promise<AssessmentAttemptResponseDto[]> {
    return apiClient
      .get<AssessmentAttemptResponseDto[]>(`${API_ENDPOINTS.assessments}/${assessmentId}/results`)
      .then((response) => response.data);
  },

  /** The real student-safe question view - never includes correct answers. */
  getQuestionsForAttempt(assessmentId: string): Promise<StudentAssessmentQuestionResponseDto[]> {
    return apiClient
      .get<StudentAssessmentQuestionResponseDto[]>(
        `${API_ENDPOINTS.assessments}/${assessmentId}/questions/attempt`,
      )
      .then((response) => response.data);
  },

  startAttempt(assessmentId: string): Promise<AssessmentAttemptResponseDto> {
    return apiClient
      .post<AssessmentAttemptResponseDto>(`${API_ENDPOINTS.assessments}/${assessmentId}/attempts`, {})
      .then((response) => response.data);
  },

  recordAnswer(
    attemptId: string,
    payload: RecordAssessmentAnswerPayload,
  ): Promise<AssessmentAttemptResponseDto> {
    return apiClient
      .patch<AssessmentAttemptResponseDto>(
        `${API_ENDPOINTS.assessments}/attempts/${attemptId}/answer`,
        payload,
      )
      .then((response) => response.data);
  },

  submitAttempt(attemptId: string): Promise<AssessmentAttemptResponseDto> {
    return apiClient
      .post<AssessmentAttemptResponseDto>(`${API_ENDPOINTS.assessments}/attempts/${attemptId}/submit`, {})
      .then((response) => response.data);
  },

  getMyAttempts(): Promise<AssessmentAttemptResponseDto[]> {
    return apiClient
      .get<AssessmentAttemptResponseDto[]>(`${API_ENDPOINTS.assessments}/attempts/me`)
      .then((response) => response.data);
  },
};
