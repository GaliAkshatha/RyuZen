import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  assignMentorSchema,
  type AssignMentorFormValues,
} from "@/features/students/schemas/student.schemas";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

interface AssignMentorFormProps {
  facultyOptions: FacultyResponseDto[];
  currentMentorId?: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AssignMentorFormValues) => void;
}

/**
 * Filters to ACTIVE faculty only — this is not a UI-only preference,
 * it's the exact rule the backend enforces (AssignMentorUseCase throws
 * "Mentor must be an active faculty member." for anything else,
 * verified this milestone). Matching it here means the dropdown never
 * offers a choice the backend would reject.
 */
export function AssignMentorForm({
  facultyOptions,
  currentMentorId,
  isSubmitting,
  error,
  onSubmit,
}: AssignMentorFormProps) {
  const activeFaculty = useMemo(
    () => facultyOptions.filter((faculty) => faculty.status === "ACTIVE"),
    [facultyOptions],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AssignMentorFormValues>({
    resolver: zodResolver(assignMentorSchema),
    defaultValues: { facultyId: currentMentorId ?? "" },
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
            <SelectTrigger aria-label="Select mentor">
              <SelectValue placeholder="Select an active faculty member" />
            </SelectTrigger>
            <SelectContent>
              {activeFaculty.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  {facultyLabel(faculty)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Assigning…" : "Assign Mentor"}
      </Button>
    </form>
  );
}
