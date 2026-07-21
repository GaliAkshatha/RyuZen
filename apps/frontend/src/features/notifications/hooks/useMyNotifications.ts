import { useApiQuery } from "@/hooks/useApiQuery";

import { notificationService } from "@/features/notifications/services/notification.service";

export const MY_NOTIFICATIONS_QUERY_KEY = ["notifications", "mine"] as const;

export function useMyNotifications() {
  return useApiQuery({
    queryKey: MY_NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationService.listMine,
  });
}
