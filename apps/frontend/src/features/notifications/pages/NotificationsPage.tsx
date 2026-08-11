import { useState } from "react";
import { Bell, Megaphone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/Tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { NotificationType } from "@/types/enums";

import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications";
import { useSendNotification } from "@/features/notifications/hooks/useSendNotification";
import { SendNotificationForm } from "@/features/notifications/components/SendNotificationForm";
import { NotificationRow } from "@/features/notifications/components/NotificationRow";
import { canSendNotifications } from "@/features/notifications/utils/notificationPermissions";
import type { NotificationResponseDto } from "@/features/notifications/types/notification.types";

function NotificationList({ notifications }: { notifications: NotificationResponseDto[] }) {
  if (notifications.length === 0) {
    return <EmptyState title="Nothing here" description="You're all caught up." />;
  }
  return (
    <ul className="flex flex-col gap-2">
      {notifications.map((notification) => (
        <NotificationRow key={notification.id} notification={notification} />
      ))}
    </ul>
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

  const all = notifications ?? [];
  const unread = all.filter((n) => !n.isRead);
  const announcements = all.filter((n) => n.type === NotificationType.ANNOUNCEMENT);
  const canSend = canSendNotifications(user?.role);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Bell className="h-6 w-6 text-primary" aria-hidden="true" />
          Notifications
        </h1>
        {unread.length > 0 && (
          <p className="mt-1 font-body text-sm text-muted-foreground">{unread.length} unread.</p>
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
      ) : all.length === 0 ? (
        <EmptyState title="No notifications yet" description="You're all caught up." />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="flex h-auto w-fit gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-md border border-border bg-card/60 data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-md border border-border bg-card/60 data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10"
            >
              Unread {unread.length > 0 && `(${unread.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="rounded-md border border-border bg-card/60 data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10"
            >
              Announcements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <NotificationList notifications={all} />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList notifications={unread} />
          </TabsContent>
          <TabsContent value="announcements">
            <NotificationList notifications={announcements} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
