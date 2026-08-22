import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, Settings as SettingsIcon, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/DropdownMenu";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { initialsOf } from "@/utils/initialsOf";
import { useAuth } from "@/contexts/AuthContext";

import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications";

/**
 * Genuinely shared - identity/notifications/theme/logout are the same
 * concern for every role. Role-specific content lives in the sidebar
 * and page content, never here.
 */
export function TopbarV2({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const { user, logout } = useAuth();
  const { data: notifications } = useMyNotifications();
  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/40 px-4">
      <div className="flex items-center gap-2">
        {onOpenMobileNav && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Button variant="ghost" size="icon" asChild className="relative" aria-label="Notifications">
          <Link to="/app/notifications">
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
              aria-label="Account menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile.image || undefined} alt={user?.name ?? ""} />
                <AvatarFallback>{initialsOf(user?.name ?? "?")}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/app/profile" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" aria-hidden="true" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
