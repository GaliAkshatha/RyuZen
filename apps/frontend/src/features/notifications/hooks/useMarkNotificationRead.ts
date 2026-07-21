import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { notificationService } from "@/features/notifications/services/notification.service";
import { MY_NOTIFICATIONS_QUERY_KEY } from "@/features/notifications/hooks/useMyNotifications";
import type { NotificationResponseDto } from "@/features/notifications/types/notification.types";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useApiMutation<NotificationResponseDto, string>({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_NOTIFICATIONS_QUERY_KEY });
    },
  });
}
