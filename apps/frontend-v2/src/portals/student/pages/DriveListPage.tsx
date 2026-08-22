import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { PlacementDriveStatus } from "@/domains/placement-drives/placementDrive.types";

/**
 * Titled "Placement Drives," not "Relevant Opportunities" - this list
 * itself still shows every open drive, since checking real
 * eligibility per-drive here would mean an eligibility API call per
 * row. The now-real per-drive eligibility signal (GET
 * /placements/:id/my-eligibility, closing a previously-confirmed
 * backend gap) lives on the drive's own detail page instead.
 */
export function DriveListPage() {
  const { data: drives, isLoading, isError, error, refetch } = usePlacementDrives();
  const { data: companies } = useCompanies();

  const companyById = new Map((companies ?? []).map((c) => [c.id, c]));
  const publishedDrives = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.PUBLISHED);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Placement Drives</h1>
        <p className="text-sm text-muted-foreground">
          Every open drive in your organization. Open a drive to see your real eligibility.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : publishedDrives.length === 0 ? (
        <EmptyState icon={Briefcase} title="No open drives right now" description="Check back soon." />
      ) : (
        <div className="flex flex-col gap-2">
          {publishedDrives.map((drive) => (
            <Link key={drive.id} to={`/student/drives/${drive.id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">{drive.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {companyById.get(drive.companyId)?.name ?? "Company"}
                      {drive.package && ` · ${drive.package}`}
                      {drive.location && ` · ${drive.location}`}
                    </p>
                  </div>
                  {drive.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Apply by {new Date(drive.deadline).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
