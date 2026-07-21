import { Building2, Briefcase, Send, TrendingUp, CheckCircle2, XCircle } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { usePlacementAnalytics } from "@/features/placement-analytics/hooks/usePlacementAnalytics";

export function PlacementAnalyticsPage() {
  const { data: analytics, isLoading, isError, error, refetch } = usePlacementAnalytics();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
        Placement Analytics
      </h1>

      {isLoading || !analytics ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">Companies</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Companies" value={analytics.totalCompanies} icon={Building2} />
              <StatCard
                label="Active Companies"
                value={analytics.activeCompanies}
                icon={CheckCircle2}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">
              Placement Drives
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Drives" value={analytics.totalDrives} icon={Briefcase} />
              <StatCard label="Draft" value={analytics.draftDrives} />
              <StatCard label="Published" value={analytics.publishedDrives} />
              <StatCard label="Closed" value={analytics.closedDrives} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">
              Applications
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Applications"
                value={analytics.totalApplications}
                icon={Send}
              />
              <StatCard label="Applied" value={analytics.appliedCount} />
              <StatCard label="Shortlisted" value={analytics.shortlistedCount} />
              <StatCard label="Selected" value={analytics.selectedCount} icon={CheckCircle2} />
              <StatCard label="Rejected" value={analytics.rejectedCount} icon={XCircle} />
              {/* placementRate is already a rounded 0-100 percentage
                  server-side (Math.round(selected/total * 100)) —
                  confirmed against GetPlacementAnalyticsUseCase this
                  milestone, not a 0-1 fraction to be multiplied here. */}
              <StatCard
                label="Placement Rate"
                value={`${analytics.placementRate}%`}
                icon={TrendingUp}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
