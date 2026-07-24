import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  assignHeadOfDepartmentSchema,
  type AssignHeadOfDepartmentFormValues,
} from "@/features/departments/schemas/department.schemas";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

interface AssignHodFormProps {
  facultyOptions: FacultyResponseDto[];
  currentHeadUserId?: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AssignHeadOfDepartmentFormValues) => void;
}

/**
 * Faculty options are shown as "employeeId — designation", not a name
 * — see facultyLabels.ts for why (no user-lookup endpoint exists yet).
 * The backend's AssignHeadOfDepartmentSchema places no constraint
 * limiting selection to faculty already in this department, so every
 * active faculty member in the organization is offered, matching the
 * schema exactly rather than inventing a narrower filter.
 */
export function AssignHodForm({
  facultyOptions,
  currentHeadUserId,
  isSubmitting,
  error,
  onSubmit,
}: AssignHodFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AssignHeadOfDepartmentFormValues>({
    resolver: zodResolver(assignHeadOfDepartmentSchema),
    defaultValues: { userId: currentHeadUserId ?? "" },
  });

  const fieldErrors = errors.userId ? [errors.userId.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <Controller
        control={control}
        name="userId"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label="Select faculty member">
              <SelectValue placeholder="Select a faculty member" />
            </SelectTrigger>
            <SelectContent>
              {facultyOptions.map((faculty) => (
                <SelectItem key={faculty.userId} value={faculty.userId}>
                  {facultyLabel(faculty)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Assigning…" : "Assign Head of Department"}
      </Button>
    </form>
  );
}
