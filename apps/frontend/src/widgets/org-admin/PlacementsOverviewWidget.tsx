import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { usePlacementAnalytics } from "@/features/placement-analytics/hooks/usePlacementAnalytics";

/**
 * Wired in PL4. Explicitly named in 03_UI_Blueprint.md's Org Admin
 * Dashboard section — the one dashboard widget with direct backing in
 * the frontend documentation, not just the backend. Composes the exact
 * same use case AD5's Admin Dashboard will also reuse.
 */
export function PlacementsOverviewWidget() {
  const { data: analytics, isLoading } = usePlacementAnalytics();

  return (
    <WidgetCard title="Placements Overview" icon={TrendingUp} wired>
      {isLoading || !analytics ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3 font-body text-sm">
            <div>
              <p className="text-muted-foreground">Published Drives</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {analytics.publishedDrives}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Applications</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {analytics.totalApplications}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Selected</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {analytics.selectedCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Placement Rate</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {`${analytics.placementRate}%`}
              </p>
            </div>
          </div>
          <Link
            to="/app/admin/placement-analytics"
            className="font-body text-xs text-primary underline underline-offset-4"
          >
            View full analytics
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
