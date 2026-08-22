import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateOrganization } from "@/domains/organizations/hooks/useCreateOrganization";
import { CreateOrganizationForm } from "@/domains/organizations/components/CreateOrganizationForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { mutate: createOrganization, isPending } = useCreateOrganization();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: { name: string; code: string; emailDomains: string[] }) {
    setSubmitError(null);
    createOrganization(values, {
      onSuccess: (organization) => navigate(`/platform/organizations/${organization.id}`),
      onError: (error) => setSubmitError(error as AppApiError),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create organization</CardTitle>
          <CardDescription>
            Add a new institution to the platform. You can configure detailed settings after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
