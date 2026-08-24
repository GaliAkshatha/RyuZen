import { useState } from "react";
import { Bell, X, PenSquare } from "lucide-react";

import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { useNotifications } from "@/domains/notifications/hooks/useNotifications";
import { useMarkNotificationRead } from "@/domains/notifications/hooks/useMarkNotificationRead";
import { ComposeNotificationForm } from "@/domains/notifications/components/ComposeNotificationForm";
import { canComposeNotifications } from "@/domains/notifications/canComposeNotifications";

/**
 * Real slide-out panel, not a page - reuses the exact same real
 * useNotifications/useMarkNotificationRead hooks the old full-page
 * NotificationsPage used, so nothing about the underlying data
 * changed, only the presentation (overlay instead of navigation).
 * The Compose toggle only ever appears for roles that can genuinely
 * send (SUPER_ADMIN/ORG_ADMIN/FACULTY, confirmed against the real
 * backend's own allow-list) - every other role never sees it.
 */
export function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { data: notifications, isLoading, isError, error, refetch } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const [composing, setComposing] = useState(false);

  if (!open) return null;

  const canCompose = canComposeNotifications(user?.role);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
          <div className="flex items-center gap-1.5">
            {canCompose && (
              <button
                onClick={() => setComposing((v) => !v)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
                  composing && "bg-primary/10 text-primary",
                )}
                aria-label={composing ? "Back to notifications" : "Compose a notification"}
              >
                <PenSquare className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {composing ? (
            <ComposeNotificationForm onSent={() => setComposing(false)} />
          ) : isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : !notifications || notifications.length === 0 ? (
            <div className="flex flex-col gap-3">
              <EmptyState icon={Bell} title="No notifications" />
              {canCompose && (
                <Button size="sm" variant="outline" className="w-fit self-center" onClick={() => setComposing(true)}>
                  Compose a notification
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "cursor-pointer rounded-lg border border-border p-3 transition-colors",
                    !n.isRead && "border-primary/40 bg-primary/5",
                  )}
                  onClick={() => !n.isRead && markRead(n.id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                  {n.createdAt && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
