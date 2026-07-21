import { Link } from "react-router-dom";
import { ExternalLink, Send } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyJobApplications } from "@/features/job-applications/hooks/useMyJobApplications";

import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";

export function MyApplicationsPage() {
  const { data: applications, isLoading, isError, error, refetch } = useMyJobApplications();
  const { data: drives } = usePlacementDrives();

  const driveById = new Map((drives ?? []).map((d) => [d.id, d]));

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Send className="h-6 w-6 text-primary" aria-hidden="true" />
        My Applications
      </h1>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : !applications || applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open placement drives and apply to get started."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((application) => {
            const drive = driveById.get(application.placementId);
            return (
              <Card key={application.id}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">
                    <Link
                      to={`/app/placements/drives/${application.placementId}`}
                      className="hover:underline"
                    >
                      {drive?.title ?? application.placementId}
                    </Link>
                  </CardTitle>
                  <StatusBadge status={application.status} />
                </CardHeader>
                <CardContent className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
                  <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                  {application.remarks && <span>Remarks: {application.remarks}</span>}
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary underline underline-offset-4"
                    >
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      Submitted resume
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
