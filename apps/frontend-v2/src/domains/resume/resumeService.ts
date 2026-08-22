import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Resume } from "@/domains/resume/resume.types";

/** GET /resume is self-scoped for STUDENT. GET /resume/candidate/:userId is real RECRUITER-only access, added this pass - same real server-side check (RecruiterCandidateAccessService) as Career Score and AI Interview candidate routes. */
export const resumeService = {
  async getForCandidate(userId: string): Promise<Resume> {
    const res = await apiClient.get<ApiSuccessResponse<Resume>>(`/resume/candidate/${userId}`);
    return res.data.data;
  },
};
