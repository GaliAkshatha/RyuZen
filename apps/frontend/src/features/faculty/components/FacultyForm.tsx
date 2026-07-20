import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createFacultySchema,
  updateFacultySchema,
  type CreateFacultyFormValues,
  type UpdateFacultyFormValues,
} from "@/features/faculty/schemas/faculty.schemas";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";
import type { DepartmentResponseDto } from "@/features/departments/types/department.types";

interface FacultyFormProps {
  faculty?: FacultyResponseDto;
  departments: DepartmentResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateFacultyFormValues | UpdateFacultyFormValues) => void;
}

/**
 * `userId` on create has no search/lookup UI — see faculty.types.ts for
 * why (no user-search endpoint exists in this milestone's scope). The
 * org admin must already know the target user's ID.
 */
export function FacultyForm({
  faculty,
  departments,
  isSubmitting,
  error,
  onSubmit,
}: FacultyFormProps) {
  const isEdit = Boolean(faculty);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateFacultyFormValues>({
    resolver: zodResolver(isEdit ? updateFacultySchema : createFacultySchema),
    defaultValues: {
      userId: "",
      departmentId: faculty?.departmentId ?? "",
      employeeId: faculty?.employeeId ?? "",
      designation: faculty?.designation ?? "",
      specialization: faculty?.specialization ?? "",
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
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="employeeId" className="font-body text-sm font-medium text-foreground">
          Employee ID
        </label>
        <Input
          id="employeeId"
          aria-invalid={Boolean(errors.employeeId)}
          {...register("employeeId")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="designation" className="font-body text-sm font-medium text-foreground">
          Designation
        </label>
        <Input
          id="designation"
          aria-invalid={Boolean(errors.designation)}
          {...register("designation")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="specialization" className="font-body text-sm font-medium text-foreground">
          Specialization
        </label>
        <Input id="specialization" {...register("specialization")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create faculty record"}
      </Button>
    </form>
  );
}
