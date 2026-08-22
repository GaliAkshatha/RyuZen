import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateFaculty } from "@/domains/faculty/hooks/useCreateFaculty";
import { CreateFacultyForm } from "@/domains/faculty/components/CreateFacultyForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateFacultyPage() {
  const navigate = useNavigate();
  const { mutate: createFaculty, isPending } = useCreateFaculty();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: {
    userId: string;
    departmentId?: string;
    employeeId: string;
    designation: string;
    specialization?: string;
  }) {
    setSubmitError(null);
    createFaculty(values, {
      onSuccess: (faculty) => navigate(`/organization/faculty/${faculty.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add faculty profile</CardTitle>
          <CardDescription>Link an existing user account to a real faculty profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateFacultyForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
