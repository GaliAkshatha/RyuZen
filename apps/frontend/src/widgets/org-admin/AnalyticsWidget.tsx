import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useAdminDashboard } from "@/features/admin-dashboard/hooks/useAdminDashboard";

/** Wired in AD5. */
export function AnalyticsWidget() {
  const { data, isLoading } = useAdminDashboard();

  return (
    <WidgetCard title="Analytics" icon={BarChart3} wired>
      {isLoading || !data ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3 font-body text-sm">
            <div>
              <p className="text-muted-foreground">Users</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {data.users.total}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Activities</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {data.activities.total}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Clubs</p>
              <p className="font-display text-lg font-semibold text-foreground">{data.clubs}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Events</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {data.events.total}
              </p>
            </div>
          </div>
          <Link
            to="/app/admin/dashboard"
            className="font-body text-xs text-primary underline underline-offset-4"
          >
            View full analytics
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
