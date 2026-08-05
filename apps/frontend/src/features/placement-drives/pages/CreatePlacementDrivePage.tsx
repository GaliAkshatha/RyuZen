import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreatePlacementDrive } from "@/features/placement-drives/hooks/useCreatePlacementDrive";
import { PlacementDriveForm } from "@/features/placement-drives/components/PlacementDriveForm";
import type { CreatePlacementDriveFormValues } from "@/features/placement-drives/schemas/placementDrive.schemas";

import { useCompanies } from "@/features/companies/hooks/useCompanies";

export function CreatePlacementDrivePage() {
  const navigate = useNavigate();
  const { data: companies } = useCompanies();
  const { mutate, isPending, error } = useCreatePlacementDrive();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        to="/app/placements/drives"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Placement Drives
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Placement Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <PlacementDriveForm
            companies={companies ?? []}
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) => {
              const { deadline, ...rest } = values as CreatePlacementDriveFormValues;
              mutate(
                { ...rest, deadline: deadline?.toISOString() },
                {
                  onSuccess: (created) =>
                    navigate(`/app/placements/drives/${created.id}`, { replace: true }),
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
