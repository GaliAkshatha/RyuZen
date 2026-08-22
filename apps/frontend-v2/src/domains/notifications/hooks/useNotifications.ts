import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { notificationService } from "@/domains/notifications/notificationService";
import type { Notification } from "@/domains/notifications/notification.types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export function useNotifications() {
  return useApiQuery<Notification[]>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationService.list,
  });
}
