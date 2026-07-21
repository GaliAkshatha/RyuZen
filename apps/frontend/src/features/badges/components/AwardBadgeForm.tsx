import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  awardBadgeSchema,
  type AwardBadgeFormValues,
} from "@/features/badges/schemas/badge.schemas";
import type { StudentResponseDto } from "@/features/students/types/student.types";
import { studentLabel } from "@/features/students/utils/studentLabels";

interface AwardBadgeFormProps {
  studentOptions: StudentResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AwardBadgeFormValues) => void;
}

export function AwardBadgeForm({
  studentOptions,
  isSubmitting,
  error,
  onSubmit,
}: AwardBadgeFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardBadgeFormValues>({
    resolver: zodResolver(awardBadgeSchema),
    defaultValues: { studentId: "" },
  });

  const fieldErrors = errors.studentId ? [errors.studentId.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <Controller
        control={control}
        name="studentId"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label="Select student">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {studentOptions.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {studentLabel(student)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Awarding…" : "Award Badge"}
      </Button>
    </form>
  );
}
