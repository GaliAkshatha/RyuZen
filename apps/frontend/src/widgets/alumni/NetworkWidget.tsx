import { Link } from "react-router-dom";
import { Users } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { Badge } from "@/shared/ui/Badge";

import { useMyConnections } from "@/features/connections/hooks/useMyConnections";
import { usePendingConnectionRequests } from "@/features/connections/hooks/usePendingConnectionRequests";

/**
 * Real "Network Activity" for Alumni - built from the same real,
 * already-tested Connections data (useMyConnections,
 * usePendingConnectionRequests) used throughout Connect. Genuinely
 * functional, unlike MentorshipOverviewWidget's honest placeholder -
 * Alumni has full access to Connect (People/Requests/Connections),
 * this was simply never surfaced on their own dashboard.
 */
export function NetworkWidget() {
  const { data: connections, isLoading: loadingConnections } = useMyConnections();
  const { data: pending, isLoading: loadingPending } = usePendingConnectionRequests();

  const isLoading = loadingConnections || loadingPending;

  return (
    <WidgetCard title="Network" icon={Users} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Link to="/app/connect/connections" className="group">
              <p className="font-display text-2xl font-bold leading-none text-foreground group-hover:text-primary">
                {(connections ?? []).length}
              </p>
              <p className="font-body text-xs text-muted-foreground">Connections</p>
            </Link>
            {(pending ?? []).length > 0 && (
              <Link to="/app/connect/requests" className="group flex items-center gap-1.5">
                <Badge variant="secondary">{(pending ?? []).length} new</Badge>
                <span className="font-body text-xs text-muted-foreground group-hover:text-primary">
                  requests
                </span>
              </Link>
            )}
          </div>
          <Link
            to="/app/connect/people"
            className="w-fit font-body text-xs text-primary underline underline-offset-4"
          >
            Find people to connect with
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
