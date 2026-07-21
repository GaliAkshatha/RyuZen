import { useState } from "react";
import { Bell, BellOff, Megaphone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications";
import { useMarkNotificationRead } from "@/features/notifications/hooks/useMarkNotificationRead";
import { useSendNotification } from "@/features/notifications/hooks/useSendNotification";
import { SendNotificationForm } from "@/features/notifications/components/SendNotificationForm";
import { canSendNotifications } from "@/features/notifications/utils/notificationPermissions";
import type { NotificationResponseDto } from "@/features/notifications/types/notification.types";

function NotificationRow({ notification }: { notification: NotificationResponseDto }) {
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
          <span className="font-body text-sm font-medium text-foreground">
            {notification.title}
          </span>
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

export function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: notifications, isLoading, isError, error, refetch } = useMyNotifications();
  const {
    mutate: sendNotification,
    isPending: isSending,
    error: sendError,
  } = useSendNotification();
  const [showSendForm, setShowSendForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;
  const canSend = canSendNotifications(user?.role);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Bell className="h-6 w-6 text-primary" aria-hidden="true" />
          Notifications
        </h1>
        {unreadCount > 0 && (
          <p className="mt-1 font-body text-sm text-muted-foreground">{unreadCount} unread.</p>
        )}
      </div>

      {canSend && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Send a Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showSendForm ? (
              <SendNotificationForm
                isSubmitting={isSending}
                error={sendError}
                onSubmit={(values) =>
                  sendNotification(values, {
                    onSuccess: () => {
                      toast({ title: "Notification sent" });
                      setShowSendForm(false);
                    },
                  })
                }
              />
            ) : (
              <Button size="sm" onClick={() => setShowSendForm(true)}>
                Compose
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="You're all caught up." />
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </div>
  );
}
