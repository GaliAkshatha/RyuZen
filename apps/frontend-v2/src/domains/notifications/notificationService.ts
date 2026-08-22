import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Notification } from "@/domains/notifications/notification.types";

export const notificationService = {
  async list(): Promise<Notification[]> {
    const res = await apiClient.get<ApiSuccessResponse<Notification[]>>("/notifications");
    return res.data.data;
  },

  async markRead(id: string): Promise<Notification> {
    const res = await apiClient.patch<ApiSuccessResponse<Notification>>(`/notifications/${id}/read`);
    return res.data.data;
  },
};
