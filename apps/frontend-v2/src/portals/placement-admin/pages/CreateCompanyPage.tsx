import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateCompany } from "@/domains/companies/hooks/useCreateCompany";
import { CreateCompanyForm } from "@/domains/companies/components/CreateCompanyForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const { mutate: createCompany, isPending } = useCreateCompany();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: Parameters<typeof createCompany>[0]) {
    setSubmitError(null);
    createCompany(values, {
      onSuccess: () => navigate("/placement-admin/companies"),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add company</CardTitle>
          <CardDescription>Companies you can run placement drives for.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCompanyForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
