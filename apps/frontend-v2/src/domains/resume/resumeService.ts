import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse, AppApiError } from "@/shared/types/api.types";
import type { Resume, ResumeTemplate, GenerateResumeRequest, UpdateResumeVisibilityRequest } from "@/domains/resume/resume.types";

/** GET /resume is self-scoped for STUDENT. GET /resume/candidate/:userId is real RECRUITER-only access, added this pass - same real server-side check (RecruiterCandidateAccessService) as Career Score and AI Interview candidate routes. */
export const resumeService = {
  async getForCandidate(userId: string): Promise<Resume> {
    const res = await apiClient.get<ApiSuccessResponse<Resume>>(`/resume/candidate/${userId}`);
    return res.data.data;
  },

  /** Confirmed via GetMyResumeUseCase directly: throws a real 404 with "You have not generated a resume yet." if no resume exists yet - caught here and returned as null, since "no resume yet" is a normal, expected state for a hook to handle, not an error. */
  async getMine(): Promise<Resume | null> {
    try {
      const res = await apiClient.get<ApiSuccessResponse<Resume>>("/resume");
      return res.data.data;
    } catch (err) {
      const apiErr = err as AppApiError;
      if (apiErr.statusCode === 404) return null;
      throw err;
    }
  },

  async listTemplates(): Promise<ResumeTemplate[]> {
    const res = await apiClient.get<ApiSuccessResponse<ResumeTemplate[]>>("/resume/templates");
    return res.data.data;
  },

  async generate(payload: GenerateResumeRequest): Promise<Resume> {
    const res = await apiClient.post<ApiSuccessResponse<Resume>>("/resume/generate", payload);
    return res.data.data;
  },

  async updateVisibility(payload: UpdateResumeVisibilityRequest): Promise<Resume> {
    const res = await apiClient.patch<ApiSuccessResponse<Resume>>("/resume", payload);
    return res.data.data;
  },
};
