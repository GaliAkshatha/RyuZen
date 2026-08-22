import { useParams } from "react-router-dom";
import { Send, Lock, FileText, CheckCircle2, Award, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatCard } from "@/shared/components/StatCard";
import { usePlacementDrive } from "@/domains/placement-drives/hooks/usePlacementDrive";
import { usePublishPlacementDrive } from "@/domains/placement-drives/hooks/usePublishPlacementDrive";
import { useClosePlacementDrive } from "@/domains/placement-drives/hooks/useClosePlacementDrive";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { useApplicationsForDrive } from "@/domains/job-applications/hooks/useApplicationsForDrive";
import { ApplicationReviewRow } from "@/domains/job-applications/components/ApplicationReviewRow";
import { PlacementDriveStatus } from "@/domains/placement-drives/placementDrive.types";
import { JobApplicationStatus } from "@/domains/job-applications/jobApplication.types";

export function DriveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: drive, isLoading, isError, error, refetch } = usePlacementDrive(id ?? "");
  const { data: companies } = useCompanies();
  const { data: applications, isLoading: isLoadingApplications } = useApplicationsForDrive(id ?? "");
  const { mutate: publishDrive, isPending: isPublishing } = usePublishPlacementDrive();
  const { mutate: closeDrive, isPending: isClosing } = useClosePlacementDrive();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !drive) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const company = companies?.find((c) => c.id === drive.companyId);
  const shortlisted = (applications ?? []).filter((a) => a.status === JobApplicationStatus.SHORTLISTED).length;
  const selected = (applications ?? []).filter((a) => a.status === JobApplicationStatus.SELECTED).length;
  const rejected = (applications ?? []).filter((a) => a.status === JobApplicationStatus.REJECTED).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{drive.title}</h1>
          <p className="text-sm text-muted-foreground">
            {company?.name ?? "Company"}
            {drive.package && ` · ${drive.package}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={drive.status} />
          {drive.status === PlacementDriveStatus.DRAFT && (
            <Button
              size="sm"
              disabled={isPublishing}
              className="flex items-center gap-2"
              onClick={() => publishDrive(drive.id)}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Publish
            </Button>
          )}
          {drive.status === PlacementDriveStatus.PUBLISHED && (
            <Button
              size="sm"
              variant="outline"
              disabled={isClosing}
              className="flex items-center gap-2"
              onClick={() => closeDrive(drive.id)}
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Close
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{drive.description || "No description provided."}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Applications</h2>

        {applications && applications.length > 0 && (
          <div className="mb-4 grid grid-cols-4 gap-3">
            <StatCard icon={FileText} value={applications.length} label="Total" tone="primary" />
            <StatCard icon={CheckCircle2} value={shortlisted} label="Shortlisted" tone="warning" />
            <StatCard icon={Award} value={selected} label="Selected" tone="success" />
            <StatCard icon={XCircle} value={rejected} label="Rejected" tone="destructive" />
          </div>
        )}
        {isLoadingApplications ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !applications || applications.length === 0 ? (
          <EmptyState title="No applications yet" description="Applications will appear here once students apply." />
        ) : (
          <div className="flex flex-col gap-2">
            {applications.map((app) => (
              <ApplicationReviewRow key={app.id} application={app} placementId={drive.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
