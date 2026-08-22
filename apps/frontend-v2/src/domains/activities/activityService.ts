import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from "@/domains/activities/activity.types";

/**
 * Every call maps 1:1 to a real, confirmed SUPER_ADMIN/FACULTY route
 * (activity.routes.ts). organizationId/requesterId/requesterRole are
 * NOT sent from here - the backend extracts them from the
 * authenticated JWT itself (confirmed directly in ActivityController),
 * the frontend only ever sends the real path id and body.
 */
export const activityService = {
  async list(): Promise<Activity[]> {
    const res = await apiClient.get<ApiSuccessResponse<Activity[]>>("/activities");
    return res.data.data;
  },

  async getById(id: string): Promise<Activity> {
    const res = await apiClient.get<ApiSuccessResponse<Activity>>(`/activities/${id}`);
    return res.data.data;
  },

  async create(payload: CreateActivityRequest): Promise<Activity> {
    const res = await apiClient.post<ApiSuccessResponse<Activity>>("/activities", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateActivityRequest): Promise<Activity> {
    const res = await apiClient.patch<ApiSuccessResponse<Activity>>(`/activities/${id}`, payload);
    return res.data.data;
  },

  async publish(id: string): Promise<Activity> {
    const res = await apiClient.patch<ApiSuccessResponse<Activity>>(`/activities/${id}/publish`);
    return res.data.data;
  },

  async close(id: string): Promise<Activity> {
    const res = await apiClient.patch<ApiSuccessResponse<Activity>>(`/activities/${id}/close`);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`);
  },
};
