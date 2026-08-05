import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateActivity } from "@/features/activities/hooks/useCreateActivity";
import { ActivityForm } from "@/features/activities/components/ActivityForm";
import type { CreateActivityFormValues } from "@/features/activities/schemas/activity.schemas";

export function CreateActivityPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateActivity();

  function handleSubmit(values: CreateActivityFormValues) {
    mutate(
      {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      },
      {
        onSuccess: (created) => navigate(`/app/activities/${created.id}`, { replace: true }),
      },
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        to="/app/activities"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Activities
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) => handleSubmit(values as CreateActivityFormValues)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
