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
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
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
  const { data: departments } = useDepartments();
  const { data: companies } = useCompanies();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlacementDriveFormValues>({ resolver: zodResolver(createPlacementDriveSchema) });

  function handleFormSubmit(values: CreatePlacementDriveFormValues) {
    const batches = values.eligibilityBatches
      ?.split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    const hasEligibilityCriteria =
      (values.eligibilityDepartmentIds?.length ?? 0) > 0 ||
      (batches?.length ?? 0) > 0 ||
      values.eligibilityMinSemester !== undefined ||
      values.eligibilityMinCgpa !== undefined;

    onSubmit({
      companyId: values.companyId,
      title: values.title,
      description: values.description || undefined,
      package: values.package || undefined,
      location: values.location || undefined,
      eligibility: values.eligibility || undefined,
      eligibilityCriteria: hasEligibilityCriteria
        ? {
            departmentIds: values.eligibilityDepartmentIds,
            batches,
            minSemester: values.eligibilityMinSemester,
            minCgpa: values.eligibilityMinCgpa,
          }
        : undefined,
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
          Free text shown to students. Real enforcement uses the criteria below, not this text.
        </p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-1 text-sm font-medium text-foreground">Real eligibility criteria (optional)</p>
        <p className="mb-3 text-xs text-muted-foreground">
          These are genuinely enforced — a student who doesn't meet them will see a real rejection
          when they try to apply. Leave any field empty for no restriction on that dimension.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Department</Label>
            <Controller
              control={control}
              name="eligibilityDepartmentIds"
              render={({ field }) => (
                <Select value={field.value?.[0]} onValueChange={(v) => field.onChange([v])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any department" />
                  </SelectTrigger>
                  <SelectContent>
                    {(departments ?? []).map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="drive-eligibility-batches">Batches</Label>
              <Input id="drive-eligibility-batches" placeholder="e.g. 2022-2026" {...register("eligibilityBatches")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="drive-min-semester">Min. semester</Label>
              <Input id="drive-min-semester" type="number" min={1} max={12} {...register("eligibilityMinSemester")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="drive-min-cgpa">Min. CGPA</Label>
              <Input id="drive-min-cgpa" type="number" step="0.1" min={0} max={10} {...register("eligibilityMinCgpa")} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Comma-separated for multiple batches.</p>
        </div>
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
