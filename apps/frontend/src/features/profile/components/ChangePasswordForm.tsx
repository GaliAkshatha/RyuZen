import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from "@/features/profile/schemas/profile.schemas";
import type { ChangePasswordPayload } from "@/features/profile/types/profile.types";

export interface ChangePasswordFormProps {
  onSubmit: (payload: ChangePasswordPayload) => void;
  isSubmitting: boolean;
  error: AppApiError | null;
}

export function ChangePasswordForm({ onSubmit, isSubmitting, error }: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useAppForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function submit(values: ChangePasswordFormValues) {
    const { confirmNewPassword: _confirmNewPassword, ...payload } = values;
    onSubmit(payload);
    reset();
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentPassword" className="font-body text-sm font-medium text-foreground">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.currentPassword)}
          {...register("currentPassword")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="font-body text-sm font-medium text-foreground">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.newPassword)}
          {...register("newPassword")}
        />
        <p className="font-body text-xs text-muted-foreground">
          At least 8 characters, with an uppercase letter, lowercase letter, number, and special
          character.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmNewPassword"
          className="font-body text-sm font-medium text-foreground"
        >
          Confirm New Password
        </label>
        <Input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmNewPassword)}
          {...register("confirmNewPassword")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Changing…" : "Change password"}
      </Button>
    </form>
  );
}
