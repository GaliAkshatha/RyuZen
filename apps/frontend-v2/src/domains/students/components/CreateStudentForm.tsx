import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { createStudentSchema, type CreateStudentFormValues } from "@/domains/students/studentSchemas";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateStudentForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateStudentFormValues) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="student-user-id">User ID</Label>
        <Input id="student-user-id" placeholder="The real, existing account's user id" aria-invalid={Boolean(errors.userId)} {...register("userId")} />
        {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
        <p className="text-xs text-muted-foreground">Creates a student profile for an existing user account.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="student-usn">USN</Label>
        <Input id="student-usn" aria-invalid={Boolean(errors.usn)} {...register("usn")} />
        {errors.usn && <p className="text-xs text-destructive">{errors.usn.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="student-batch">Batch</Label>
        <Input id="student-batch" placeholder="e.g. 2022-2026" aria-invalid={Boolean(errors.batch)} {...register("batch")} />
        {errors.batch && <p className="text-xs text-destructive">{errors.batch.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="student-semester">Semester (optional)</Label>
          <Input id="student-semester" type="number" min={1} max={12} {...register("semester")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="student-cgpa">CGPA (optional)</Label>
          <Input id="student-cgpa" type="number" step="0.01" min={0} max={10} {...register("cgpa")} />
        </div>
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
        {isSubmitting ? "Creating…" : "Create student profile"}
      </Button>
    </form>
  );
}
