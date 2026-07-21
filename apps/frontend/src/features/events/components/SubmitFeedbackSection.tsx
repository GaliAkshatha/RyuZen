import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

import { useSubmitEventFeedback } from "@/features/events/hooks/useSubmitEventFeedback";
import {
  submitEventFeedbackSchema,
  type SubmitEventFeedbackFormValues,
} from "@/features/events/schemas/event.schemas";

/**
 * Gated to STUDENT, matching POST /:id/feedback's real role restriction.
 * Same backend gap as RegisterForEventSection: a student has no way to
 * proactively confirm they're registered before submitting feedback —
 * the backend's real "You are not registered for this event." (404)
 * surfaces reactively if they try and aren't.
 */
export function SubmitFeedbackSection({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const { mutate, isPending, error, isSuccess } = useSubmitEventFeedback(eventId);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitEventFeedbackFormValues>({
    resolver: zodResolver(submitEventFeedbackSchema),
    defaultValues: { feedback: "" },
  });

  if (user?.role !== UserRole.STUDENT) {
    return null;
  }

  if (isSuccess || submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-success">Thanks for your feedback!</p>
        </CardContent>
      </Card>
    );
  }

  const fieldErrors = errors.feedback ? [errors.feedback.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((values) =>
            mutate(values, { onSuccess: () => setSubmitted(true) }),
          )}
          className="flex flex-col gap-4"
          noValidate
        >
          {(fieldErrors.length > 0 || apiErrors.length > 0) && (
            <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
          )}
          <Textarea
            rows={3}
            placeholder="Share your thoughts on this event…"
            aria-invalid={Boolean(errors.feedback)}
            {...register("feedback")}
          />
          <Button type="submit" disabled={isPending} className="self-start">
            {isPending ? "Submitting…" : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
