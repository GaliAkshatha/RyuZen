import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateDepartment } from "@/domains/departments/hooks/useCreateDepartment";
import { CreateDepartmentForm } from "@/domains/departments/components/CreateDepartmentForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateDepartmentPage() {
  const navigate = useNavigate();
  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: { name: string; code: string; description?: string }) {
    setSubmitError(null);
    createDepartment(values, {
      onSuccess: (department) => navigate(`/organization/departments/${department.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create department</CardTitle>
          <CardDescription>Add a new academic department to your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateDepartmentForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
