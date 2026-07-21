import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createStudentSchema,
  updateStudentSchema,
  type CreateStudentFormValues,
  type UpdateStudentFormValues,
} from "@/features/students/schemas/student.schemas";
import type { StudentResponseDto } from "@/features/students/types/student.types";
import type { DepartmentResponseDto } from "@/features/departments/types/department.types";

interface StudentFormProps {
  student?: StudentResponseDto;
  departments: DepartmentResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateStudentFormValues | UpdateStudentFormValues) => void;
}

/**
 * `semester` is deliberately absent from the edit path — the backend's
 * UpdateStudentSchema has no semester field at all (confirmed by grep
 * this milestone); semester only changes via the dedicated Promote
 * action (see PromoteStudentAction.tsx).
 */
export function StudentForm({
  student,
  departments,
  isSubmitting,
  error,
  onSubmit,
}: StudentFormProps) {
  const isEdit = Boolean(student);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(isEdit ? updateStudentSchema : createStudentSchema),
    defaultValues: {
      userId: "",
      departmentId: student?.departmentId ?? "",
      usn: student?.usn ?? "",
      batch: student?.batch ?? "",
      semester: student?.semester,
      cgpa: student?.cgpa,
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

      {!isEdit && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="userId" className="font-body text-sm font-medium text-foreground">
              User ID
            </label>
            <Input id="userId" aria-invalid={Boolean(errors.userId)} {...register("userId")} />
            <p className="font-body text-xs text-muted-foreground">
              The ID of an existing registered user in this organization.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="departmentId" className="font-body text-sm font-medium text-foreground">
              Department (optional)
            </label>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="departmentId" aria-label="Select department">
                    <SelectValue placeholder="No department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="semester" className="font-body text-sm font-medium text-foreground">
              Semester (optional)
            </label>
            <Input id="semester" type="number" min={1} max={12} {...register("semester")} />
          </div>
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="usn" className="font-body text-sm font-medium text-foreground">
          USN
        </label>
        <Input id="usn" aria-invalid={Boolean(errors.usn)} {...register("usn")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="batch" className="font-body text-sm font-medium text-foreground">
          Batch
        </label>
        <Input id="batch" aria-invalid={Boolean(errors.batch)} {...register("batch")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cgpa" className="font-body text-sm font-medium text-foreground">
          CGPA (optional)
        </label>
        <Input id="cgpa" type="number" step="0.01" min={0} max={10} {...register("cgpa")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create student"}
      </Button>
    </form>
  );
}
