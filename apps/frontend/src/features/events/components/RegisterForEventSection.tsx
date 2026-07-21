import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useAuth } from "@/contexts/AuthContext";
import { EventStatus, UserRole } from "@/types/enums";

import { useRegisterForEvent } from "@/features/events/hooks/useRegisterForEvent";
import type { EventResponseDto } from "@/features/events/types/event.types";

/**
 * Mirrors RegisterForEventUseCase's real rules for UX purposes
 * (published, registration deadline not passed) — confirmed against
 * the backend this milestone. Only STUDENT can register at all
 * (authorizePermission(STUDENT) on POST /:id/register — a real, hard
 * backend rule, unlike Activities' open submission).
 *
 * GET /:id/registrations excludes STUDENT entirely, confirmed this
 * milestone — a student has no backend-supported way to proactively
 * check "am I already registered" on page load. This section can only
 * reflect a successful registration made in the current session (local
 * state); if they already registered in an earlier session, the only
 * signal is the backend's own 409 "You are already registered for this
 * event." surfaced reactively if they try again.
 */
export function RegisterForEventSection({ event }: { event: EventResponseDto }) {
  const { user } = useAuth();
  const { mutate, isPending, error, isSuccess } = useRegisterForEvent(event.id);
  const [justRegistered, setJustRegistered] = useState(false);

  if (user?.role !== UserRole.STUDENT) {
    return null;
  }

  if (isSuccess || justRegistered) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-success">You're registered for this event.</p>
        </CardContent>
      </Card>
    );
  }

  const isPublished = event.status === EventStatus.PUBLISHED;
  const isPastDeadline = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  if (!isPublished || isPastDeadline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-muted-foreground">
            {!isPublished
              ? "This event is not yet published."
              : "The registration deadline has passed."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {flattenApiErrors(error).length > 0 && (
          <FormErrorSummary errors={flattenApiErrors(error)} />
        )}
        <Button
          disabled={isPending}
          onClick={() => mutate(undefined, { onSuccess: () => setJustRegistered(true) })}
          className="self-start"
        >
          {isPending ? "Registering…" : "Register"}
        </Button>
      </CardContent>
    </Card>
  );
}
