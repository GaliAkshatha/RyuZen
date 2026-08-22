import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { notificationService } from "@/domains/notifications/notificationService";
import { NOTIFICATIONS_QUERY_KEY } from "@/domains/notifications/hooks/useNotifications";
import type { Notification } from "@/domains/notifications/notification.types";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useApiMutation<Notification, string>({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}
