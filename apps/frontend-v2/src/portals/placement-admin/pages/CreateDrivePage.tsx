import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreatePlacementDrive } from "@/domains/placement-drives/hooks/useCreatePlacementDrive";
import { CreatePlacementDriveForm } from "@/domains/placement-drives/components/CreatePlacementDriveForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateDrivePage() {
  const navigate = useNavigate();
  const { mutate: createDrive, isPending } = useCreatePlacementDrive();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: Parameters<typeof createDrive>[0]) {
    setSubmitError(null);
    createDrive(values, {
      onSuccess: (drive) => navigate(`/placement-admin/drives/${drive.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create placement drive</CardTitle>
          <CardDescription>New drive starts as a draft - publish it when you're ready for students to see it.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePlacementDriveForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
