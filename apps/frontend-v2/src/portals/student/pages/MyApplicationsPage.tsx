import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useMyApplications } from "@/domains/job-applications/hooks/useMyApplications";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";

export function MyApplicationsPage() {
  const { data: applications, isLoading, isError, error, refetch } = useMyApplications();
  const { data: drives } = usePlacementDrives();
  const { data: companies } = useCompanies();

  const driveById = new Map((drives ?? []).map((d) => [d.id, d]));
  const companyById = new Map((companies ?? []).map((c) => [c.id, c]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Applications</h1>
        <p className="text-sm text-muted-foreground">Every drive you've applied to, and its real current status.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !applications || applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Browse open drives and apply to get started."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((app) => {
            const drive = driveById.get(app.placementId);
            const company = drive ? companyById.get(drive.companyId) : undefined;
            return (
              <Link key={app.id} to={`/student/drives/${app.placementId}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-foreground">{drive?.title ?? "Placement Drive"}</p>
                      <p className="text-xs text-muted-foreground">
                        {company?.name ?? ""} · Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
