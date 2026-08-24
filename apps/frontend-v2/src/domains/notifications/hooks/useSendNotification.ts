import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { notificationService } from "@/domains/notifications/notificationService";
import type { Notification, SendNotificationRequest } from "@/domains/notifications/notification.types";

export function useSendNotification() {
  return useApiMutation<Notification, SendNotificationRequest>({
    mutationFn: (payload) => notificationService.send(payload),
  });
}
