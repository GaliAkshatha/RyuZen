import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { PlacementDrive, CreatePlacementDriveRequest } from "@/domains/placement-drives/placementDrive.types";

/** GET routes are open to any authenticated user; write actions confirmed ORG_ADMIN/PLACEMENT_ADMIN only. */
export const placementDriveService = {
  async list(): Promise<PlacementDrive[]> {
    const res = await apiClient.get<ApiSuccessResponse<PlacementDrive[]>>("/placement-drives");
    return res.data.data;
  },

  async getById(id: string): Promise<PlacementDrive> {
    const res = await apiClient.get<ApiSuccessResponse<PlacementDrive>>(`/placement-drives/${id}`);
    return res.data.data;
  },

  async create(payload: CreatePlacementDriveRequest): Promise<PlacementDrive> {
    const res = await apiClient.post<ApiSuccessResponse<PlacementDrive>>("/placement-drives", payload);
    return res.data.data;
  },

  /** Real, STUDENT-only self-check - reuses the exact same isStudentEligibleForDrive logic the backend uses to gate actual applications, not a client-side approximation. */
  async checkMyEligibility(id: string): Promise<{ eligible: boolean; reasons: string[] }> {
    const res = await apiClient.get<ApiSuccessResponse<{ eligible: boolean; reasons: string[] }>>(
      `/placement-drives/${id}/my-eligibility`,
    );
    return res.data.data;
  },

  async publish(id: string): Promise<PlacementDrive> {
    const res = await apiClient.patch<ApiSuccessResponse<PlacementDrive>>(`/placement-drives/${id}/publish`);
    return res.data.data;
  },

  async close(id: string): Promise<PlacementDrive> {
    const res = await apiClient.patch<ApiSuccessResponse<PlacementDrive>>(`/placement-drives/${id}/close`);
    return res.data.data;
  },
};
