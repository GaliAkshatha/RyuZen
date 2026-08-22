import { Bell } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { cn } from "@/shared/utils/cn";
import { useNotifications } from "@/domains/notifications/hooks/useNotifications";
import { useMarkNotificationRead } from "@/domains/notifications/hooks/useMarkNotificationRead";

export function NotificationsPage() {
  const { data: notifications, isLoading, isError, error, refetch } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn("cursor-pointer", !n.isRead && "border-primary/40 bg-primary/5")}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <CardContent className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{n.title}</p>
                  {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                {n.createdAt && (
                  <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
