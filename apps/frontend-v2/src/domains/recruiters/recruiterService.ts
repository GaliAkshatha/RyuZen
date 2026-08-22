import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";
import type { RecruiterProfile } from "@/domains/recruiters/recruiter.types";

export interface SearchApplicantsParams {
  skills?: string[];
  minCgpa?: number;
}

/**
 * All confirmed RECRUITER-only, scoped server-side to the caller's
 * own real company (resolved from their Recruiter profile - never a
 * companyId taken from the request, confirmed by reading the real
 * use case earlier this engagement). getMyProfile closes a
 * previously-confirmed backend gap (no GET /recruiters/me existed) -
 * now real, enabling a genuine "My Company" experience.
 */
export const recruiterService = {
  async getMyProfile(): Promise<RecruiterProfile> {
    const res = await apiClient.get<ApiSuccessResponse<RecruiterProfile>>("/recruiters/me");
    return res.data.data;
  },

  async listMyApplicants(): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiSuccessResponse<JobApplication[]>>("/recruiters/me/applicants");
    return res.data.data;
  },

  async searchMyApplicants(params: SearchApplicantsParams): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiSuccessResponse<JobApplication[]>>("/recruiters/me/applicants/search", {
      params: {
        skills: params.skills?.join(","),
        minCgpa: params.minCgpa,
      },
    });
    return res.data.data;
  },
};
