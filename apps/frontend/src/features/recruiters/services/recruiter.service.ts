import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { JobApplicationResponseDto } from "@/features/job-applications/types/jobApplication.types";

export interface SearchApplicantsParams {
  skills?: string[];
  minCgpa?: number;
}

/**
 * getMyApplicants and searchApplicants both never take a companyId —
 * resolved entirely server-side from the recruiter's own real
 * profile, confirmed against GetApplicantsForRecruiterUseCase and
 * SearchApplicantsUseCase directly. There is no way for either call
 * to return another company's applicants.
 */
export const recruiterService = {
  getMyApplicants(): Promise<JobApplicationResponseDto[]> {
    return apiClient
      .get<JobApplicationResponseDto[]>(`${API_ENDPOINTS.recruiters}/me/applicants`)
      .then((response) => response.data);
  },

  /**
   * Skill matching on the backend is against REAL, verified skills
   * only (SearchApplicantsUseCase) — a student's own unverified,
   * self-typed skill claim never produces a match here.
   */
  searchApplicants(params: SearchApplicantsParams): Promise<JobApplicationResponseDto[]> {
    const query = new URLSearchParams();
    if (params.skills && params.skills.length > 0) {
      query.set("skills", params.skills.join(","));
    }
    if (params.minCgpa !== undefined) {
      query.set("minCgpa", String(params.minCgpa));
    }

    return apiClient
      .get<JobApplicationResponseDto[]>(
        `${API_ENDPOINTS.recruiters}/me/applicants/search?${query.toString()}`,
      )
      .then((response) => response.data);
  },
};
