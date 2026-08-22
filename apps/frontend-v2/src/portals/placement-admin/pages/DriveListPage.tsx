import { Link } from "react-router-dom";
import { Plus, Briefcase } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";

export function DriveListPage() {
  const { data: drives, isLoading, isError, error, refetch } = usePlacementDrives();
  const { data: companies } = useCompanies();

  const companyById = new Map((companies ?? []).map((c) => [c.id, c]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Placement Drives</h1>
          <p className="text-sm text-muted-foreground">Every drive across all companies.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/placement-admin/drives/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New drive
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !drives || drives.length === 0 ? (
        <EmptyState icon={Briefcase} title="No drives yet" description="Create a drive for a company to get started." />
      ) : (
        <div className="flex flex-col gap-2">
          {drives.map((drive) => (
            <Link key={drive.id} to={`/placement-admin/drives/${drive.id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">{drive.title}</p>
                    <p className="text-xs text-muted-foreground">{companyById.get(drive.companyId)?.name ?? "Company"}</p>
                  </div>
                  <StatusBadge status={drive.status} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
