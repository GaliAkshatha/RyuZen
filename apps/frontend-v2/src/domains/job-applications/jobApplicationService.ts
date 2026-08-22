import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  JobApplication,
  ApplyToPlacementRequest,
  UpdateJobApplicationStatusRequest,
} from "@/domains/job-applications/jobApplication.types";

export const jobApplicationService = {
  async apply(placementId: string, payload: ApplyToPlacementRequest): Promise<JobApplication> {
    const res = await apiClient.post<ApiSuccessResponse<JobApplication>>(`/applications/${placementId}`, payload);
    return res.data.data;
  },

  async listMine(): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiSuccessResponse<JobApplication[]>>("/applications/me");
    return res.data.data;
  },

  /** Confirmed ORG_ADMIN/PLACEMENT_ADMIN only. */
  async listForDrive(placementId: string): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiSuccessResponse<JobApplication[]>>(`/applications/placements/${placementId}`);
    return res.data.data;
  },

  /** Confirmed ORG_ADMIN/PLACEMENT_ADMIN only. */
  async updateStatus(id: string, payload: UpdateJobApplicationStatusRequest): Promise<JobApplication> {
    const res = await apiClient.patch<ApiSuccessResponse<JobApplication>>(`/applications/${id}/status`, payload);
    return res.data.data;
  },
};
