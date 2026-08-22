import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { createActivitySchema, type CreateActivityFormValues } from "@/domains/activities/activitySchemas";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import type { CreateActivityRequest, ActivityType } from "@/domains/activities/activity.types";
import type { AppApiError } from "@/shared/types/api.types";

function parseCsvList(value?: string): string[] | undefined {
  if (!value) return undefined;
  const items = value.split(",").map((v) => v.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}

/**
 * The real form (step 2 of the wizard) - `type` comes from step 1 as
 * a prop, not a field here. Targeting is 4 real, independent inputs
 * (department/batch/semester/section) shown together, not gated
 * behind the visibility dropdown - confirmed the backend enforces
 * whichever ones are populated regardless of visibility's value.
 */
export function CreateActivityForm({
  type,
  onSubmit,
  isSubmitting,
  submitError,
}: {
  type: ActivityType;
  onSubmit: (values: CreateActivityRequest) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: { visibility: "PUBLIC", points: 0, penaltyPoints: 0 },
  });

  function handleFormSubmit(values: CreateActivityFormValues) {
    onSubmit({
      title: values.title,
      description: values.description,
      type,
      visibility: values.visibility,
      departmentIds: values.departmentIds,
      batches: parseCsvList(values.batches),
      semesters: parseCsvList(values.semesters)?.map(Number).filter((n) => !Number.isNaN(n)),
      sections: parseCsvList(values.sections),
      points: values.points,
      penaltyPoints: values.penaltyPoints,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      attachments: [],
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
        <Label htmlFor="activity-title">Title</Label>
        <Input id="activity-title" aria-invalid={Boolean(errors.title)} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activity-description">Description</Label>
        <Input id="activity-description" aria-invalid={Boolean(errors.description)} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Visibility</Label>
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["PUBLIC", "DEPARTMENT", "SEMESTER", "YEAR", "PRIVATE"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-1 text-sm font-medium text-foreground">Target groups</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Department is required — every activity must specify at least one real target
          department. Batch, semester, and section further narrow within it; leave any of those
          empty for no restriction on that dimension.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Department <span className="text-destructive">*</span></Label>
            <Controller
              control={control}
              name="departmentIds"
              render={({ field }) => (
                <Select value={field.value?.[0]} onValueChange={(v) => field.onChange([v])}>
                  <SelectTrigger aria-invalid={Boolean(errors.departmentIds)}>
                    <SelectValue placeholder="Select a department" />
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
            {errors.departmentIds && <p className="text-xs text-destructive">{errors.departmentIds.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="activity-batches">Batches</Label>
              <Input id="activity-batches" placeholder="e.g. 2022-2026" {...register("batches")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="activity-semesters">Semesters</Label>
              <Input id="activity-semesters" placeholder="e.g. 6, 8" {...register("semesters")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="activity-sections">Sections</Label>
              <Input id="activity-sections" placeholder="e.g. B" {...register("sections")} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Comma-separated for multiple values.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity-points">Points</Label>
          <Input id="activity-points" type="number" min={0} {...register("points")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity-penalty">Penalty points</Label>
          <Input id="activity-penalty" type="number" min={0} {...register("penaltyPoints")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity-start">Start date</Label>
          <Input id="activity-start" type="datetime-local" aria-invalid={Boolean(errors.startDate)} {...register("startDate")} />
          {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity-end">End date</Label>
          <Input id="activity-end" type="datetime-local" aria-invalid={Boolean(errors.endDate)} {...register("endDate")} />
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create activity"}
      </Button>
    </form>
  );
}
