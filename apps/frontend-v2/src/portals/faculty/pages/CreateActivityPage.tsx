import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useCreateActivity } from "@/domains/activities/hooks/useCreateActivity";
import { CreateActivityForm } from "@/domains/activities/components/CreateActivityForm";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateActivityPage() {
  const navigate = useNavigate();
  const { mutate: createActivity, isPending } = useCreateActivity();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  function handleSubmit(values: Parameters<typeof createActivity>[0]) {
    setSubmitError(null);
    createActivity(values, {
      onSuccess: (activity) => navigate(`/faculty/activities/${activity.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create activity</CardTitle>
          <CardDescription>New activity starts as a draft - publish it when you're ready for students to see it.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateActivityForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
        </CardContent>
      </Card>
    </div>
  );
}
