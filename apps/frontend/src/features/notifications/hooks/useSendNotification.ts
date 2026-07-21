import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { notificationService } from "@/features/notifications/services/notification.service";
import { MY_NOTIFICATIONS_QUERY_KEY } from "@/features/notifications/hooks/useMyNotifications";
import type {
  NotificationResponseDto,
  SendNotificationPayload,
} from "@/features/notifications/types/notification.types";

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useApiMutation<NotificationResponseDto, SendNotificationPayload>({
    mutationFn: notificationService.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_NOTIFICATIONS_QUERY_KEY });
    },
  });
}
