import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Bell } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { NotificationDrawer } from "@/shared/components/NotificationDrawer";
import { useNotifications } from "@/domains/notifications/hooks/useNotifications";

export interface TopNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

/**
 * Shared topbar used by every one of the 7 portals - logo left,
 * centered nav (per product direction), bell + avatar right. Profile
 * is deliberately NOT a nav item here - it's only reachable by
 * clicking the avatar, and the Profile page itself replaces this
 * entire topbar (it's mounted as a standalone route, not nested under
 * any portal layout).
 */
export function TopNav({ items, roleLabel }: { items: TopNavItem[]; roleLabel: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "";

  return (
    <>
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-info text-xs font-extrabold text-primary-foreground">
            R
          </div>
          <span className="text-sm font-bold text-foreground">RyuZen</span>
        </div>

        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1" aria-label="Primary">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-card bg-destructive" />
            )}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-transparent hover:ring-primary/40"
            aria-label={`${user?.name ?? roleLabel} — go to profile`}
          >
            {initials}
          </button>
        </div>
      </header>

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
