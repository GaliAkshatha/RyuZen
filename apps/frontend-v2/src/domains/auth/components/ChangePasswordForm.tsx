import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useChangePassword } from "@/domains/auth/hooks/useChangePassword";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/domains/auth/updateProfileSchema";
import type { AppApiError } from "@/shared/types/api.types";

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  function onSubmit(values: ChangePasswordFormValues) {
    setSubmitError(null);
    setSuccess(false);
    changePassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
        },
        onError: (err) => setSubmitError(err),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{submitError.message}</p>
      )}
      {success && (
        <p className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-sm text-success">
          <Check className="h-4 w-4" aria-hidden="true" />
          Password updated
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="current-password">Current password</Label>
        <Input id="current-password" type="password" aria-invalid={Boolean(errors.currentPassword)} {...register("currentPassword")} />
        {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input id="new-password" type="password" aria-invalid={Boolean(errors.newPassword)} {...register("newPassword")} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        <p className="text-xs text-muted-foreground">At least 8 characters, with an uppercase letter, lowercase letter, number, and special character.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input id="confirm-password" type="password" aria-invalid={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
