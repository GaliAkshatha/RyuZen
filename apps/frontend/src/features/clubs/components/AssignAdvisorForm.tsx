import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  assignAdvisorSchema,
  type AssignAdvisorFormValues,
} from "@/features/clubs/schemas/club.schemas";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

interface AssignAdvisorFormProps {
  facultyOptions: FacultyResponseDto[];
  currentAdvisorId?: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AssignAdvisorFormValues) => void;
}

export function AssignAdvisorForm({
  facultyOptions,
  currentAdvisorId,
  isSubmitting,
  error,
  onSubmit,
}: AssignAdvisorFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignAdvisorFormValues>({
    resolver: zodResolver(assignAdvisorSchema),
    defaultValues: { facultyId: currentAdvisorId ?? "" },
  });

  const fieldErrors = errors.facultyId ? [errors.facultyId.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <Controller
        control={control}
        name="facultyId"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label="Select faculty advisor">
              <SelectValue placeholder="Select a faculty member" />
            </SelectTrigger>
            <SelectContent>
              {facultyOptions.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  {facultyLabel(faculty)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Assigning…" : "Assign Advisor"}
      </Button>
    </form>
  );
}
