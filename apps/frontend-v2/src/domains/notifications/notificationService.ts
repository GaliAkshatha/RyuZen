import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Notification, SendNotificationRequest } from "@/domains/notifications/notification.types";

export const notificationService = {
  async list(): Promise<Notification[]> {
    const res = await apiClient.get<ApiSuccessResponse<Notification[]>>("/notifications");
    return res.data.data;
  },

  async markRead(id: string): Promise<Notification> {
    const res = await apiClient.patch<ApiSuccessResponse<Notification>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  /** Confirmed real SUPER_ADMIN/ORG_ADMIN/FACULTY access, but genuinely scoped server-side per role - which audiences each can pick is enforced in SendNotificationUseCase, not just this route gate. */
  async send(payload: SendNotificationRequest): Promise<Notification> {
    const res = await apiClient.post<ApiSuccessResponse<Notification>>("/notifications", payload);
    return res.data.data;
  },
};
