import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import { alumniSchema, type AlumniFormValues } from "@/features/alumni/schemas/alumni.schemas";
import type { AlumniResponseDto } from "@/features/alumni/types/alumni.types";

interface AlumniFormProps {
  alumnus: AlumniResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AlumniFormValues) => void;
}

export function AlumniForm({ alumnus, isSubmitting, error, onSubmit }: AlumniFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AlumniFormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      name: alumnus.name ?? "",
      graduationYear: alumnus.graduationYear,
      company: alumnus.company ?? "",
      designation: alumnus.designation ?? "",
    },
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
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="graduationYear" className="font-body text-sm font-medium text-foreground">
          Graduation Year
        </label>
        <Input
          id="graduationYear"
          type="number"
          min={1950}
          max={2100}
          {...register("graduationYear")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="font-body text-sm font-medium text-foreground">
          Company
        </label>
        <Input id="company" {...register("company")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="designation" className="font-body text-sm font-medium text-foreground">
          Designation
        </label>
        <Input id="designation" {...register("designation")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
