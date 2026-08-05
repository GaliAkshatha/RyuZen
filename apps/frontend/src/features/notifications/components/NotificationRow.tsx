import { BellOff } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/utils/cn";

import { useMarkNotificationRead } from "@/features/notifications/hooks/useMarkNotificationRead";
import type { NotificationResponseDto } from "@/features/notifications/types/notification.types";

/**
 * Shared between the full /app/notifications page and the quick-access
 * drawer opened from the topbar bell - one real row rendering, not two
 * places independently deciding what a notification looks like.
 */
export function NotificationRow({ notification }: { notification: NotificationResponseDto }) {
  const { mutate, isPending } = useMarkNotificationRead();

  return (
    <li
      className={cn(
        "flex items-start justify-between gap-2 rounded-md border p-3",
        notification.isRead ? "border-border" : "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-medium text-foreground">{notification.title}</span>
          {notification.type && <Badge variant="outline">{notification.type}</Badge>}
        </div>
        <p className="font-body text-sm text-muted-foreground">{notification.message}</p>
        {notification.createdAt && (
          <span className="font-body text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        )}
      </div>
      {!notification.isRead && (
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => mutate(notification.id)}
          className="shrink-0"
        >
          <BellOff className="mr-2 h-4 w-4" aria-hidden="true" />
          {isPending ? "Marking…" : "Mark read"}
        </Button>
      )}
    </li>
  );
}
