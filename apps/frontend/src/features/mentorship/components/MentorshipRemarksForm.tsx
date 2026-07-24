import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  updateMentorshipSchema,
  type UpdateMentorshipFormValues,
} from "@/features/mentorship/schemas/mentorship.schemas";

interface MentorshipRemarksFormProps {
  currentRemarks?: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: UpdateMentorshipFormValues) => void;
}

export function MentorshipRemarksForm({
  currentRemarks,
  isSubmitting,
  error,
  onSubmit,
}: MentorshipRemarksFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<UpdateMentorshipFormValues>({
    resolver: zodResolver(updateMentorshipSchema),
    defaultValues: { remarks: currentRemarks ?? "" },
  });

  const fieldErrors = errors.remarks ? [errors.remarks.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="remarks" className="font-body text-sm font-medium text-foreground">
          Remarks
        </label>
        <Textarea
          id="remarks"
          rows={4}
          aria-invalid={Boolean(errors.remarks)}
          {...register("remarks")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Saving…" : "Save Remarks"}
      </Button>
    </form>
  );
}
