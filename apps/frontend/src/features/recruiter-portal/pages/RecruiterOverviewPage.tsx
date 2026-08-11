import { Card, CardContent } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyApplicants } from "@/features/recruiters/hooks/useMyApplicants";
import { RecruiterLayout } from "@/features/recruiter-portal/components/RecruiterLayout";

/**
 * Real hiring funnel, computed from this recruiter's own real
 * applicant pool - the "hiring analytics" a Placement Management
 * System needs, not a placeholder metric. Split out of the former
 * monolithic dashboard as its own Overview workspace.
 */
export function RecruiterOverviewPage() {
  const { data: applicants, isLoading, isError, error, refetch } = useMyApplicants();

  if (isError) {
    return (
      <RecruiterLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </RecruiterLayout>
    );
  }

  const funnelCounts = {
    APPLIED: (applicants ?? []).filter((a) => a.status === "APPLIED").length,
    SHORTLISTED: (applicants ?? []).filter((a) => a.status === "SHORTLISTED").length,
    SELECTED: (applicants ?? []).filter((a) => a.status === "SELECTED").length,
    REJECTED: (applicants ?? []).filter((a) => a.status === "REJECTED").length,
  };

  return (
    <RecruiterLayout>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="py-4">
              <p className="font-body text-xs text-muted-foreground">New</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {funnelCounts.APPLIED}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="font-body text-xs text-muted-foreground">Shortlisted</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {funnelCounts.SHORTLISTED}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="font-body text-xs text-muted-foreground">Offered</p>
              <p className="font-display text-2xl font-bold text-success">
                {funnelCounts.SELECTED}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="font-body text-xs text-muted-foreground">Rejected</p>
              <p className="font-display text-2xl font-bold text-muted-foreground">
                {funnelCounts.REJECTED}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </RecruiterLayout>
  );
}
