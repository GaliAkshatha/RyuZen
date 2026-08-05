import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { UserRole } from "@/types/enums";

import { inviteUserSchema, type InviteUserFormValues } from "@/features/invitations/schemas/invitation.schemas";

interface InviteUserFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: InviteUserFormValues) => void;
}

const INVITABLE_ROLES = [UserRole.STUDENT, UserRole.FACULTY, UserRole.ALUMNI, UserRole.PLACEMENT_ADMIN] as const;

const ROLE_LABELS: Record<(typeof INVITABLE_ROLES)[number], string> = {
  [UserRole.STUDENT]: "Student",
  [UserRole.FACULTY]: "Faculty",
  [UserRole.ALUMNI]: "Alumni",
  [UserRole.PLACEMENT_ADMIN]: "Placement Admin",
};

export function InviteUserForm({ isSubmitting, error, onSubmit }: InviteUserFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { name: "", email: "", role: UserRole.STUDENT },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-body text-sm font-medium text-foreground">
            Email
          </label>
          <Input id="email" type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-medium text-foreground">Role</label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Select role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {INVITABLE_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending invitation…" : "Send Invitation"}
      </Button>
    </form>
  );
}
