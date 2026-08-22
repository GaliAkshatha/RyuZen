import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { createActivitySchema, type CreateActivityFormValues } from "@/domains/activities/activitySchemas";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import type { CreateActivityRequest } from "@/domains/activities/activity.types";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateActivityForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateActivityRequest) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: { visibility: "PUBLIC", points: 0, penaltyPoints: 0 },
  });

  const visibility = watch("visibility");

  function handleFormSubmit(values: CreateActivityFormValues) {
    onSubmit({
      title: values.title,
      description: values.description,
      type: values.type,
      visibility: values.visibility,
      departmentIds: values.visibility === "DEPARTMENT" ? values.departmentIds : undefined,
      batches:
        values.visibility === "SEMESTER" || values.visibility === "YEAR"
          ? values.batches?.split(",").map((b) => b.trim()).filter(Boolean)
          : undefined,
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {["ASSIGNMENT", "WORKSHOP", "EVENT", "HACKATHON", "QUIZ", "FORM", "SURVEY"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p className="text-xs text-destructive">Type is required</p>}
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
      </div>

      {visibility === "DEPARTMENT" && (
        <div className="flex flex-col gap-1.5">
          <Label>Department</Label>
          <Controller
            control={control}
            name="departmentIds"
            render={({ field }) => (
              <Select value={field.value?.[0]} onValueChange={(v) => field.onChange([v])}>
                <SelectTrigger>
                  <SelectValue placeholder="Restrict to a department" />
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
          <p className="text-xs text-muted-foreground">Only students in this department will be able to submit.</p>
        </div>
      )}

      {(visibility === "SEMESTER" || visibility === "YEAR") && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity-batches">Batches</Label>
          <Input id="activity-batches" placeholder="e.g. 2022-2026, 2023-2027" {...register("batches")} />
          <p className="text-xs text-muted-foreground">
            Comma-separated. Only students in these batches will be able to submit.
          </p>
        </div>
      )}

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
