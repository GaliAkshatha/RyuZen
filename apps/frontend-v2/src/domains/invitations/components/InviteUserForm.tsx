import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { inviteUserSchema, type InviteUserFormValues } from "@/domains/invitations/invitationSchema";
import type { InviteUserRequest } from "@/domains/invitations/invitation.types";
import type { AppApiError } from "@/shared/types/api.types";

const ROLE_OPTIONS = [
  { value: "PLACEMENT_ADMIN", label: "Placement Admin" },
  { value: "FACULTY", label: "Faculty" },
  { value: "STUDENT", label: "Student" },
  { value: "ALUMNI", label: "Alumni" },
] as const;

export function InviteUserForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: InviteUserRequest) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InviteUserFormValues>({ resolver: zodResolver(inviteUserSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invite-name">Name</Label>
        <Input id="invite-name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invite-email">Email</Label>
        <Input id="invite-email" type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Role</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-xs text-destructive">Select a role</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Sending invite…" : "Send invitation"}
      </Button>
    </form>
  );
}
