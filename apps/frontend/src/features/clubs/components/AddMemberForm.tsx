import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";
import type { AppApiError } from "@/types/api";
import { ClubMemberRole } from "@/types/enums";

import {
  addClubMemberSchema,
  type AddClubMemberFormValues,
} from "@/features/clubs/schemas/club.schemas";
import type { StudentResponseDto } from "@/features/students/types/student.types";
import { studentLabel } from "@/features/students/utils/studentLabels";

interface AddMemberFormProps {
  studentOptions: StudentResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AddClubMemberFormValues) => void;
}

const CLUB_MEMBER_ROLES = [
  ClubMemberRole.MEMBER,
  ClubMemberRole.PRESIDENT,
  ClubMemberRole.VICE_PRESIDENT,
];

export function AddMemberForm({
  studentOptions,
  isSubmitting,
  error,
  onSubmit,
}: AddMemberFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AddClubMemberFormValues>({
    resolver: zodResolver(addClubMemberSchema),
    defaultValues: { studentId: "", role: ClubMemberRole.MEMBER },
  });

  const fieldErrors = errors.studentId ? [errors.studentId.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-medium text-foreground">Student</label>
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
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-medium text-foreground">Role</label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Select role">
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                {CLUB_MEMBER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {humanizeEnumValue(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Adding…" : "Add Member"}
      </Button>
    </form>
  );
}
