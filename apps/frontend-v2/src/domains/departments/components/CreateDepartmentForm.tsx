import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { createDepartmentSchema, type CreateDepartmentFormValues } from "@/domains/departments/departmentSchemas";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateDepartmentForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateDepartmentFormValues) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dept-name">Department name</Label>
        <Input id="dept-name" placeholder="e.g. Computer Science Engineering" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dept-code">Code</Label>
        <Input id="dept-code" placeholder="e.g. CSE" aria-invalid={Boolean(errors.code)} {...register("code")} />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dept-description">Description (optional)</Label>
        <Input id="dept-description" aria-invalid={Boolean(errors.description)} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create department"}
      </Button>
    </form>
  );
}
