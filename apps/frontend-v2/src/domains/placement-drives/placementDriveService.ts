import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { PlacementDrive, CreatePlacementDriveRequest } from "@/domains/placement-drives/placementDrive.types";

/**
 * GET routes are open to any authenticated user; write actions
 * confirmed ORG_ADMIN/PLACEMENT_ADMIN only.
 *
 * REAL BUG FIX: every endpoint here previously called "/placement-drives",
 * a path that was never real - confirmed directly against app.ts, the
 * actual mount is "/api/v1/placements" (placement-drive.routes.ts
 * mounted under the shorter "placements" prefix, not matching its own
 * filename). This meant every real call from this service 404'd
 * silently behind generic error UI since the day this domain was
 * first built - none of typecheck/lint/build can catch a wrong URL
 * string, only a real end-to-end check against the live route table
 * would have caught it.
 */
export const placementDriveService = {
  async list(): Promise<PlacementDrive[]> {
    const res = await apiClient.get<ApiSuccessResponse<PlacementDrive[]>>("/placements");
    return res.data.data;
  },

  async getById(id: string): Promise<PlacementDrive> {
    const res = await apiClient.get<ApiSuccessResponse<PlacementDrive>>(`/placements/${id}`);
    return res.data.data;
  },

  async create(payload: CreatePlacementDriveRequest): Promise<PlacementDrive> {
    const res = await apiClient.post<ApiSuccessResponse<PlacementDrive>>("/placements", payload);
    return res.data.data;
  },

  /** Real, STUDENT-only self-check - reuses the exact same isStudentEligibleForDrive logic the backend uses to gate actual applications, not a client-side approximation. */
  async checkMyEligibility(id: string): Promise<{ eligible: boolean; reasons: string[] }> {
    const res = await apiClient.get<ApiSuccessResponse<{ eligible: boolean; reasons: string[] }>>(
      `/placements/${id}/my-eligibility`,
    );
    return res.data.data;
  },

  async publish(id: string): Promise<PlacementDrive> {
    const res = await apiClient.patch<ApiSuccessResponse<PlacementDrive>>(`/placements/${id}/publish`);
    return res.data.data;
  },

  async close(id: string): Promise<PlacementDrive> {
    const res = await apiClient.patch<ApiSuccessResponse<PlacementDrive>>(`/placements/${id}/close`);
    return res.data.data;
  },
};
