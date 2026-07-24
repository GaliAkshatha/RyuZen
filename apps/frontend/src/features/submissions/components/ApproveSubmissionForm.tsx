import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  approveSubmissionSchema,
  type ApproveSubmissionFormValues,
} from "@/features/submissions/schemas/submission.schemas";

interface ApproveSubmissionFormProps {
  suggestedPoints: number;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: ApproveSubmissionFormValues) => void;
}

export function ApproveSubmissionForm({
  suggestedPoints,
  isSubmitting,
  error,
  onSubmit,
}: ApproveSubmissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<ApproveSubmissionFormValues>({
    resolver: zodResolver(approveSubmissionSchema),
    defaultValues: { feedback: "", pointsAwarded: suggestedPoints },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="approveFeedback" className="font-body text-sm font-medium text-foreground">
          Feedback
        </label>
        <Textarea
          id="approveFeedback"
          rows={3}
          aria-invalid={Boolean(errors.feedback)}
          {...register("feedback")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pointsAwarded" className="font-body text-sm font-medium text-foreground">
          Points Awarded
        </label>
        <Input id="pointsAwarded" type="number" min={0} step={1} {...register("pointsAwarded")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Approving…" : "Approve"}
      </Button>
    </form>
  );
}
