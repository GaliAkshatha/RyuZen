import { useParams } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useEvent } from "@/features/events/hooks/useEvent";
import { useUpdateEvent } from "@/features/events/hooks/useUpdateEvent";
import { useEventRegistrations } from "@/features/events/hooks/useEventRegistrations";
import { EventForm } from "@/features/events/components/EventForm";
import { PublishEventAction } from "@/features/events/components/PublishEventAction";
import { DeleteEventAction } from "@/features/events/components/DeleteEventAction";
import { RegisterForEventSection } from "@/features/events/components/RegisterForEventSection";
import { canManageEvents } from "@/features/events/utils/eventPermissions";
import type { UpdateEventFormValues } from "@/features/events/schemas/event.schemas";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: event, isLoading, isError, error, refetch } = useEvent(id ?? "");
  const { mutate: updateEvent, isPending, error: updateError } = useUpdateEvent(id ?? "");
  const canManage = canManageEvents(user?.role);
  const { data: registrations } = useEventRegistrations(canManage ? (id ?? "") : "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !event) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-foreground">{event.title}</h1>
          <StatusBadge status={event.status} className="w-fit" />
          <div className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {new Date(event.startDate).toLocaleDateString()} –{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {event.venue}
              </span>
            )}
            {event.capacity && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Capacity: {event.capacity}
              </span>
            )}
          </div>
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <PublishEventAction event={event} />
            <DeleteEventAction event={event} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap font-body text-sm text-foreground">
            {event.description}
          </p>
        </CardContent>
      </Card>

      <RegisterForEventSection event={event} />

      {canManage && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm text-muted-foreground">
                {registrations?.length ?? 0} student{registrations?.length === 1 ? "" : "s"}{" "}
                registered.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm
                event={event}
                isSubmitting={isPending}
                error={updateError}
                onSubmit={(values) => {
                  const { startDate, endDate, registrationDeadline, ...rest } =
                    values as UpdateEventFormValues;
                  updateEvent(
                    {
                      ...rest,
                      startDate: startDate?.toISOString(),
                      endDate: endDate?.toISOString(),
                      registrationDeadline: registrationDeadline?.toISOString(),
                    },
                    { onSuccess: () => toast({ title: "Event updated" }) },
                  );
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
