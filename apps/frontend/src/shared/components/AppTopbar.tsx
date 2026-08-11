import { Link } from "react-router-dom";
import { LogOut, UserRound, Settings as SettingsIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/DropdownMenu";
import { NotificationBell } from "@/shared/components/NotificationBell";
import { RoleBadge } from "@/shared/components/RoleBadge";
import type { UserRole } from "@/types/enums";
import { initialsOf } from "@/utils/initialsOf";

export interface AppTopbarProps {
  userName: string;
  userRole: UserRole;
  avatarUrl?: string;
  unreadNotificationCount?: number;
  onNotificationClick?: () => void;
  onLogout: () => void;
  /** Optional slot for a mobile sidebar-toggle button, rendered on the left. */
  leadingSlot?: React.ReactNode;
  className?: string;
}


export function AppTopbar({
  userName,
  userRole,
  avatarUrl,
  unreadNotificationCount,
  onNotificationClick,
  onLogout,
  leadingSlot,
  className,
}: AppTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">{leadingSlot}</div>

      <div className="flex items-center gap-2">
        <NotificationBell unreadCount={unreadNotificationCount} onClick={onNotificationClick} />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-md p-1 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8 ring-1 ring-primary/30 ring-offset-1 ring-offset-background transition-shadow hover:ring-primary/50">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>{initialsOf(userName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span className="font-body text-sm font-medium text-foreground">{userName}</span>
                <RoleBadge role={userRole} className="w-fit" />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
