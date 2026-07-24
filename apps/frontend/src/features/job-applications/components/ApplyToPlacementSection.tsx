import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { useApplyToPlacement } from "@/features/job-applications/hooks/useApplyToPlacement";
import {
  applyToPlacementSchema,
  type ApplyToPlacementFormValues,
} from "@/features/job-applications/schemas/jobApplication.schemas";

/**
 * `resume` is optional — if left blank, the backend automatically uses
 * the student's saved CE6 Resume URL instead, confirmed this
 * milestone. This is a genuine fallback, not an omission, so the
 * placeholder text says so rather than treating the field as required.
 */
export function ApplyToPlacementSection({ placementId }: { placementId: string }) {
  const { toast } = useToast();
  const { mutate, isPending, error } = useApplyToPlacement(placementId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<ApplyToPlacementFormValues>({
    resolver: zodResolver(applyToPlacementSchema),
    defaultValues: { resume: "" },
  });

  const fieldErrors = errors.resume ? [errors.resume.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutate(
          { resume: values.resume?.trim() ? values.resume.trim() : undefined },
          { onSuccess: () => toast({ title: "Application submitted" }) },
        ),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="resume" className="font-body text-sm font-medium text-foreground">
          Resume URL (optional — leave blank to use your saved resume)
        </label>
        <Input id="resume" placeholder="https://…" {...register("resume")} />
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        {isPending ? "Applying…" : "Apply"}
      </Button>
    </form>
  );
}
