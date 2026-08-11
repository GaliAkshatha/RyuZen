import { NavLink, Outlet } from "react-router-dom";
import { Users, UserPlus, Contact, MessageCircle, UsersRound } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { usePendingConnectionRequests } from "@/features/connections/hooks/usePendingConnectionRequests";

const TABS = [
  { to: "/app/connect/people", label: "People", icon: Users },
  { to: "/app/connect/requests", label: "Requests", icon: UserPlus },
  { to: "/app/connect/connections", label: "My Connections", icon: Contact },
  { to: "/app/clubs", label: "Groups", icon: UsersRound },
  { to: "/app/chat", label: "Messages", icon: MessageCircle },
];

/**
 * "Chat should be like LinkedIn/Instagram - see people, request to
 * connect." One real hub, mirroring PlacementsLayout/AIToolsLayout
 * exactly: real people directory, real connection requests, real
 * accepted connections, and real messaging (the existing Chat feature,
 * unchanged - now reached FROM a real connection rather than by typing
 * a raw user ID).
 */
export function ConnectLayout() {
  const { data: pending } = usePendingConnectionRequests();
  const pendingCount = pending?.length ?? 0;

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Users className="h-6 w-6 text-primary" aria-hidden="true" />
        Connect
      </h1>

      <nav aria-label="Connect" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tab.label}
            {tab.to === "/app/connect/requests" && pendingCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
