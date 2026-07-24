import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createEducationSchema,
  updateEducationSchema,
  type CreateEducationFormValues,
  type UpdateEducationFormValues,
} from "@/features/education/schemas/education.schemas";
import type { EducationResponseDto } from "@/features/education/types/education.types";

interface EducationFormProps {
  education?: EducationResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateEducationFormValues | UpdateEducationFormValues) => void;
  onCancel?: () => void;
}

export function EducationForm({
  education,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const isEdit = Boolean(education);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<CreateEducationFormValues>({
    resolver: zodResolver(isEdit ? updateEducationSchema : createEducationSchema),
    defaultValues: {
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      branch: education?.branch ?? "",
      cgpa: education?.cgpa,
      startYear: education?.startYear,
      endYear: education?.endYear,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="institution" className="font-body text-sm font-medium text-foreground">
            Institution
          </label>
          <Input
            id="institution"
            aria-invalid={Boolean(errors.institution)}
            {...register("institution")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="degree" className="font-body text-sm font-medium text-foreground">
            Degree
          </label>
          <Input id="degree" aria-invalid={Boolean(errors.degree)} {...register("degree")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="branch" className="font-body text-sm font-medium text-foreground">
            Branch (optional)
          </label>
          <Input id="branch" {...register("branch")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cgpa" className="font-body text-sm font-medium text-foreground">
            CGPA (optional)
          </label>
          <Input id="cgpa" type="number" min={0} max={10} step={0.01} {...register("cgpa")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startYear" className="font-body text-sm font-medium text-foreground">
            Start Year
          </label>
          <Input id="startYear" type="number" min={1950} max={2100} {...register("startYear")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endYear" className="font-body text-sm font-medium text-foreground">
            End Year (optional)
          </label>
          <Input id="endYear" type="number" min={1950} max={2100} {...register("endYear")} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add education"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
