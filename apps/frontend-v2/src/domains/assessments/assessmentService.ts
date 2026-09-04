import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Assessment,
  AssessmentQuestion,
  StudentAssessmentQuestion,
  AssessmentAttempt,
  CreateAssessmentRequest,
  AddAssessmentQuestionRequest,
  RecordAssessmentAnswerRequest,
} from "@/domains/assessments/assessment.types";

/** Real gap filled: /assessments existed on the backend (9 real routes - a full MCQ assessment builder + timed student attempt flow, with the correct-answers/no-correct-answers split enforced server-side by two genuinely different response DTOs) with zero frontend anywhere. */
export const assessmentService = {
  async list(): Promise<Assessment[]> {
    const res = await apiClient.get<ApiSuccessResponse<Assessment[]>>("/assessments");
    return res.data.data;
  },

  async create(payload: CreateAssessmentRequest): Promise<Assessment> {
    const res = await apiClient.post<ApiSuccessResponse<Assessment>>("/assessments", payload);
    return res.data.data;
  },

  async addQuestion(assessmentId: string, payload: AddAssessmentQuestionRequest): Promise<AssessmentQuestion> {
    const res = await apiClient.post<ApiSuccessResponse<AssessmentQuestion>>(`/assessments/${assessmentId}/questions`, payload);
    return res.data.data;
  },

  async publish(id: string): Promise<Assessment> {
    const res = await apiClient.patch<ApiSuccessResponse<Assessment>>(`/assessments/${id}/publish`);
    return res.data.data;
  },

  async getResults(id: string): Promise<AssessmentAttempt[]> {
    const res = await apiClient.get<ApiSuccessResponse<AssessmentAttempt[]>>(`/assessments/${id}/results`);
    return res.data.data;
  },

  /** The real student-safe question set - never includes correct answers, confirmed via GetAssessmentQuestionsForAttemptUseCase. */
  async getQuestionsForAttempt(id: string): Promise<StudentAssessmentQuestion[]> {
    const res = await apiClient.get<ApiSuccessResponse<StudentAssessmentQuestion[]>>(`/assessments/${id}/questions/attempt`);
    return res.data.data;
  },

  async startAttempt(id: string): Promise<AssessmentAttempt> {
    const res = await apiClient.post<ApiSuccessResponse<AssessmentAttempt>>(`/assessments/${id}/attempts`);
    return res.data.data;
  },

  async recordAnswer(attemptId: string, payload: RecordAssessmentAnswerRequest): Promise<AssessmentAttempt> {
    const res = await apiClient.patch<ApiSuccessResponse<AssessmentAttempt>>(`/assessments/attempts/${attemptId}/answer`, payload);
    return res.data.data;
  },

  async submitAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const res = await apiClient.post<ApiSuccessResponse<AssessmentAttempt>>(`/assessments/attempts/${attemptId}/submit`);
    return res.data.data;
  },

  async getMyAttempts(): Promise<AssessmentAttempt[]> {
    const res = await apiClient.get<ApiSuccessResponse<AssessmentAttempt[]>>("/assessments/attempts/me");
    return res.data.data;
  },
};
