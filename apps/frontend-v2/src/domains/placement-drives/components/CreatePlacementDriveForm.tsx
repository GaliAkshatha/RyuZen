import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import {
  createPlacementDriveSchema,
  type CreatePlacementDriveFormValues,
} from "@/domains/placement-drives/placementDriveSchemas";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import type { CreatePlacementDriveRequest } from "@/domains/placement-drives/placementDrive.types";
import type { AppApiError } from "@/shared/types/api.types";

export function CreatePlacementDriveForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreatePlacementDriveRequest) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const { data: companies } = useCompanies();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlacementDriveFormValues>({ resolver: zodResolver(createPlacementDriveSchema) });

  function handleFormSubmit(values: CreatePlacementDriveFormValues) {
    onSubmit({
      companyId: values.companyId,
      title: values.title,
      description: values.description || undefined,
      package: values.package || undefined,
      location: values.location || undefined,
      eligibility: values.eligibility || undefined,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label>Company</Label>
        <Controller
          control={control}
          name="companyId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {(companies ?? []).map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.companyId && <p className="text-xs text-destructive">{errors.companyId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="drive-title">Title</Label>
        <Input id="drive-title" placeholder="e.g. Software Engineer - 2026 Batch" aria-invalid={Boolean(errors.title)} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="drive-description">Description (optional)</Label>
        <Input id="drive-description" {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="drive-package">Package (optional)</Label>
          <Input id="drive-package" placeholder="e.g. 12 LPA" {...register("package")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="drive-location">Location (optional)</Label>
          <Input id="drive-location" {...register("location")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="drive-eligibility">Eligibility description (optional)</Label>
        <Input id="drive-eligibility" placeholder="e.g. CGPA 7+, no active backlogs" {...register("eligibility")} />
        <p className="text-xs text-muted-foreground">
          Free text only, shown to students - this is not enforced automatically.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="drive-deadline">Application deadline (optional)</Label>
        <Input id="drive-deadline" type="datetime-local" {...register("deadline")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create drive"}
      </Button>
    </form>
  );
}
