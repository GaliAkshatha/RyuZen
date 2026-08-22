import { Building2, Briefcase, FileText, CheckCircle2, Award, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { usePlacementAnalytics } from "@/domains/placement-analytics/hooks/usePlacementAnalytics";

/**
 * Real, single-endpoint aggregate - every number here is exactly what
 * the backend returns, no client-side recomputation. placementRate is
 * labeled precisely as "selected of applications," matching its real
 * calculation (selectedCount / totalApplications * 100, confirmed
 * directly) - not the more ambiguous "placement rate" a reader could
 * misinterpret as "% of all students placed."
 */
export function PlacementAnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = usePlacementAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Placement analytics</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your organization's placement pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Selected of applications</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-2">
            <ScoreRing value={data.placementRate} size={140} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard icon={Building2} value={data.totalCompanies} label="Companies" tone="primary" trend={`${data.activeCompanies} active`} />
          <StatCard icon={Briefcase} value={data.totalDrives} label="Total drives" tone="info" trend={`${data.publishedDrives} published`} />
          <StatCard icon={FileText} value={data.totalApplications} label="Applications" tone="primary" trend={`${data.appliedCount} applied`} />
          <StatCard icon={CheckCircle2} value={data.shortlistedCount} label="Shortlisted" tone="warning" />
          <StatCard icon={Award} value={data.selectedCount} label="Selected" tone="success" />
          <StatCard icon={XCircle} value={data.rejectedCount} label="Rejected" tone="destructive" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drive status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <StatCard icon={Briefcase} value={data.draftDrives} label="Draft" tone="warning" />
          <StatCard icon={Briefcase} value={data.publishedDrives} label="Published" tone="success" />
          <StatCard icon={Briefcase} value={data.closedDrives} label="Closed" tone="info" />
        </CardContent>
      </Card>
    </div>
  );
}
