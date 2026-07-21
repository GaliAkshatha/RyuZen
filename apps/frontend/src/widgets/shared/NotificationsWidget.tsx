import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications";

/** Wired in CM1. Shown across Student, Faculty, and Alumni dashboards. */
export function NotificationsWidget() {
  const { data: notifications, isLoading } = useMyNotifications();

  const recent = (notifications ?? [])
    .slice()
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 4);

  return (
    <WidgetCard title="Announcements" icon={Bell} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : recent.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No announcements right now.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((notification) => (
            <li key={notification.id} className="flex items-center justify-between gap-2">
              <span className="truncate font-body text-sm text-foreground">
                {notification.title}
              </span>
              {!notification.isRead && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/app/notifications"
        className="mt-2 inline-block font-body text-xs text-primary underline underline-offset-4"
      >
        View all
      </Link>
    </WidgetCard>
  );
}
