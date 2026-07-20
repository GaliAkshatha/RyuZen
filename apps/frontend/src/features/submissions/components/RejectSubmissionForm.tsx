import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  rejectSubmissionSchema,
  type RejectSubmissionFormValues,
} from "@/features/submissions/schemas/submission.schemas";

interface RejectSubmissionFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: RejectSubmissionFormValues) => void;
}

export function RejectSubmissionForm({ isSubmitting, error, onSubmit }: RejectSubmissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectSubmissionFormValues>({
    resolver: zodResolver(rejectSubmissionSchema),
    defaultValues: { feedback: "" },
  });

  const fieldErrors = errors.feedback ? [errors.feedback.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rejectFeedback" className="font-body text-sm font-medium text-foreground">
          Feedback
        </label>
        <Textarea
          id="rejectFeedback"
          rows={3}
          aria-invalid={Boolean(errors.feedback)}
          {...register("feedback")}
        />
      </div>

      <Button type="submit" variant="destructive" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Rejecting…" : "Reject"}
      </Button>
    </form>
  );
}
