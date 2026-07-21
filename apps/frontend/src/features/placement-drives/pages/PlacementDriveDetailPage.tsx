import { useParams } from "react-router-dom";
import { Briefcase, MapPin, Wallet, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { usePlacementDrive } from "@/features/placement-drives/hooks/usePlacementDrive";
import { useUpdatePlacementDrive } from "@/features/placement-drives/hooks/useUpdatePlacementDrive";
import { PlacementDriveForm } from "@/features/placement-drives/components/PlacementDriveForm";
import { PublishPlacementDriveAction } from "@/features/placement-drives/components/PublishPlacementDriveAction";
import { ClosePlacementDriveAction } from "@/features/placement-drives/components/ClosePlacementDriveAction";
import { DeletePlacementDriveAction } from "@/features/placement-drives/components/DeletePlacementDriveAction";
import { canManagePlacementDrives } from "@/features/placement-drives/utils/placementDrivePermissions";

import { useCompany } from "@/features/companies/hooks/useCompany";
import { useCompanies } from "@/features/companies/hooks/useCompanies";

export function PlacementDriveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: drive, isLoading, isError, error, refetch } = usePlacementDrive(id ?? "");
  const { data: company } = useCompany(drive?.companyId ?? "");
  const { data: companies } = useCompanies();
  const { mutate: updateDrive, isPending, error: updateError } = useUpdatePlacementDrive(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !drive) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const canManage = canManagePlacementDrives(user?.role);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">{drive.title}</h1>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-muted-foreground">
                {company?.name ?? drive.companyId}
              </span>
              <StatusBadge status={drive.status} />
            </div>
          </div>
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <PublishPlacementDriveAction drive={drive} />
            <ClosePlacementDriveAction drive={drive} />
            <DeletePlacementDriveAction drive={drive} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-body text-sm text-foreground">
            {drive.description || "No description provided."}
          </p>
          {drive.package && (
            <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              {drive.package}
            </p>
          )}
          {drive.location && (
            <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {drive.location}
            </p>
          )}
          {drive.deadline && (
            <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Deadline: {new Date(drive.deadline).toLocaleDateString()}
            </p>
          )}
          {drive.eligibility && (
            <p className="font-body text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Eligibility: </span>
              {drive.eligibility}
            </p>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Drive</CardTitle>
          </CardHeader>
          <CardContent>
            <PlacementDriveForm
              drive={drive}
              companies={companies ?? []}
              isSubmitting={isPending}
              error={updateError}
              onSubmit={(values) => {
                const { deadline, ...rest } = values;
                updateDrive(
                  { ...rest, deadline: deadline?.toISOString() },
                  { onSuccess: () => toast({ title: "Drive updated" }) },
                );
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
