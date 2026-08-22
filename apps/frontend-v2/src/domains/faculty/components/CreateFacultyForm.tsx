import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { createFacultySchema, type CreateFacultyFormValues } from "@/domains/faculty/facultySchemas";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateFacultyForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateFacultyFormValues) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateFacultyFormValues>({
    resolver: zodResolver(createFacultySchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="faculty-user-id">User ID</Label>
        <Input id="faculty-user-id" placeholder="The real, existing account's user id" aria-invalid={Boolean(errors.userId)} {...register("userId")} />
        {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
        <p className="text-xs text-muted-foreground">Creates a faculty profile for an existing user account.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="faculty-employee-id">Employee ID</Label>
        <Input id="faculty-employee-id" aria-invalid={Boolean(errors.employeeId)} {...register("employeeId")} />
        {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="faculty-designation">Designation</Label>
        <Input id="faculty-designation" placeholder="e.g. Assistant Professor" aria-invalid={Boolean(errors.designation)} {...register("designation")} />
        {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="faculty-specialization">Specialization (optional)</Label>
        <Input id="faculty-specialization" {...register("specialization")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Department (optional)</Label>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="No department" />
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

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create faculty profile"}
      </Button>
    </form>
  );
}
