import { Bell } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/shared/ui/Button";

export interface NotificationBellProps {
  /** Undefined/0 shows no badge. Wired to real unread-count data in CM1 (Notifications Module). */
  unreadCount?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ unreadCount, onClick, className }: NotificationBellProps) {
  const hasUnread = Boolean(unreadCount && unreadCount > 0);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("relative", className)}
      aria-label={hasUnread ? `Notifications, ${unreadCount} unread` : "Notifications"}
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {hasUnread && (
        <span
          className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive motion-safe:animate-glow-pulse"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
