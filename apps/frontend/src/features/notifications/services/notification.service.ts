import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  NotificationResponseDto,
  SendNotificationPayload,
} from "@/features/notifications/types/notification.types";

export const notificationService = {
  /** Implicitly scoped: broadcast notifications matching the caller's targetAudience, with isRead computed per-viewer. */
  listMine(): Promise<NotificationResponseDto[]> {
    return apiClient
      .get<NotificationResponseDto[]>(API_ENDPOINTS.notifications)
      .then((response) => response.data);
  },

  send(payload: SendNotificationPayload): Promise<NotificationResponseDto> {
    return apiClient
      .post<NotificationResponseDto>(API_ENDPOINTS.notifications, payload)
      .then((response) => response.data);
  },

  markRead(id: string): Promise<NotificationResponseDto> {
    return apiClient
      .patch<NotificationResponseDto>(`${API_ENDPOINTS.notifications}/${id}/read`, {})
      .then((response) => response.data);
  },
};
