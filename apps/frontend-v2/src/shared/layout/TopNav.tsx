import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { NotificationDrawer } from "@/shared/components/NotificationDrawer";
import { useNotifications } from "@/domains/notifications/hooks/useNotifications";

export interface TopNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /**
   * Optional dropdown group - when present, this item renders as a
   * toggle button that reveals the listed items instead of being a
   * direct link itself (its own `to`/`end` are ignored). Fully
   * backward compatible: every portal that never sets this continues
   * rendering flat top-level links exactly as before.
   */
  children?: TopNavItem[];
}

/**
 * Click-to-toggle dropdown for a grouped nav item. Closes on
 * click-outside (real document listener, not just blur, so clicking
 * another nav item or anywhere else on the page closes it cleanly)
 * and on route change (selecting a child link should close the menu,
 * not leave it hanging open over the new page).
 */
function NavDropdown({ item }: { item: TopNavItem }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isChildActive = (item.children ?? []).some((child) =>
    child.end ? location.pathname === child.to : location.pathname.startsWith(child.to),
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isChildActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
        aria-expanded={open}
      >
        <item.icon className="h-4 w-4" aria-hidden="true" />
        {item.label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-1.5 flex w-48 -translate-x-1/2 flex-col gap-0.5 rounded-lg border border-border bg-card p-1.5 shadow-lg">
          {(item.children ?? []).map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <child.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
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
          {items.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
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
            ),
          )}
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
