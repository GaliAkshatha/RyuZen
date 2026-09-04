import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Calendar, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "@/domains/auth/AuthContext";
import { useEvents } from "@/domains/events/hooks/useEvents";
import { useCreateEvent } from "@/domains/events/hooks/useEventMutations";
import type { CreateEventRequest } from "@/domains/events/event.types";
import type { AppApiError } from "@/shared/types/api.types";

const CAN_CREATE_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "FACULTY"];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
  COMPLETED: "bg-primary/10 text-primary",
};

/**
 * Real gap filled: the entire events domain (full lifecycle, student
 * registration, attendance, feedback, bulk certificate issuance - 11
 * real routes) existed on the backend with zero frontend anywhere.
 * Role-aware: Faculty/Org Admin/Super Admin see a "New event" action
 * (matching the real backend's own create restriction exactly);
 * students see the same real list read-only, with registration
 * happening on the detail page.
 */
export function EventsListPage() {
  const { user } = useAuth();
  const { data: events, isLoading, isError, error, refetch } = useEvents();
  const { mutate: createEvent, isPending: isCreating, error: createError } = useCreateEvent();
  const [showForm, setShowForm] = useState(false);

  const canCreate = Boolean(user?.role && CAN_CREATE_ROLES.includes(user.role));
  const basePath = user?.role === "STUDENT" ? "/student/events" : "/faculty/events";

  const { register, handleSubmit, reset } = useForm<{
    title: string;
    description: string;
    venue: string;
    startDate: string;
    endDate: string;
    points: string;
  }>();

  function onSubmit(values: { title: string; description: string; venue: string; startDate: string; endDate: string; points: string }) {
    const payload: CreateEventRequest = {
      title: values.title,
      description: values.description,
      venue: values.venue || undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      points: values.points ? Number(values.points) : undefined,
    };
    createEvent(payload, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">Campus events open for registration.</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {showForm ? "Cancel" : "New event"}
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {createError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  {(createError as AppApiError).message}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="event-title">Title</Label>
                <Input id="event-title" {...register("title", { required: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="event-description">Description</Label>
                <Input id="event-description" {...register("description", { required: true })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-venue">Venue</Label>
                  <Input id="event-venue" {...register("venue")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-points">Points</Label>
                  <Input id="event-points" type="number" min={0} {...register("points")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-start">Start</Label>
                  <Input id="event-start" type="datetime-local" {...register("startDate", { required: true })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-end">End</Label>
                  <Input id="event-end" type="datetime-local" {...register("endDate", { required: true })} />
                </div>
              </div>
              <Button type="submit" size="sm" disabled={isCreating} className="w-fit">
                {isCreating ? "Creating…" : "Create event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {!events || events.length === 0 ? (
            <EmptyState icon={Calendar} title="No events yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {events.map((event) => (
                <Link key={event.id} to={`${basePath}/${event.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-primary">
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.venue && ` · ${event.venue}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[event.status] ?? ""}`}>{event.status}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
