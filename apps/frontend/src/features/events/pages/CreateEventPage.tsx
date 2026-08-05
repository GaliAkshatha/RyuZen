import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateEvent } from "@/features/events/hooks/useCreateEvent";
import { EventForm } from "@/features/events/components/EventForm";
import type { CreateEventFormValues } from "@/features/events/schemas/event.schemas";

export function CreateEventPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateEvent();

  function handleSubmit(values: CreateEventFormValues) {
    mutate(
      {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        registrationDeadline: values.registrationDeadline?.toISOString(),
      },
      {
        onSuccess: (created) => navigate(`/app/events/${created.id}`, { replace: true }),
      },
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        to="/app/events"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Events
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) => handleSubmit(values as CreateEventFormValues)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
