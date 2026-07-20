import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  assignFacultyDepartmentSchema,
  type AssignFacultyDepartmentFormValues,
} from "@/features/faculty/schemas/faculty.schemas";
import type { DepartmentResponseDto } from "@/features/departments/types/department.types";

interface AssignDepartmentFormProps {
  departments: DepartmentResponseDto[];
  currentDepartmentId?: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AssignFacultyDepartmentFormValues) => void;
}

export function AssignDepartmentForm({
  departments,
  currentDepartmentId,
  isSubmitting,
  error,
  onSubmit,
}: AssignDepartmentFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignFacultyDepartmentFormValues>({
    resolver: zodResolver(assignFacultyDepartmentSchema),
    defaultValues: { departmentId: currentDepartmentId ?? "" },
  });

  const fieldErrors = errors.departmentId ? [errors.departmentId.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <Controller
        control={control}
        name="departmentId"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label="Select department">
              <SelectValue placeholder="Select a department" />
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

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Assigning…" : "Assign Department"}
      </Button>
    </form>
  );
}
