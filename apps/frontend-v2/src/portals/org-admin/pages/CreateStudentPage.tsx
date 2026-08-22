import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateStudent } from "@/domains/students/hooks/useCreateStudent";
import { CreateStudentForm } from "@/domains/students/components/CreateStudentForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateStudentPage() {
  const navigate = useNavigate();
  const { mutate: createStudent, isPending } = useCreateStudent();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: {
    userId: string;
    departmentId?: string;
    usn: string;
    batch: string;
    semester?: number;
    cgpa?: number;
  }) {
    setSubmitError(null);
    createStudent(values, {
      onSuccess: (student) => navigate(`/organization/students/${student.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add student profile</CardTitle>
          <CardDescription>Link an existing user account to a real student profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateStudentForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
