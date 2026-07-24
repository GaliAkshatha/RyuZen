import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";

interface ResetPasswordLocationState {
  email?: string;
  token?: string;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { mutate, isPending, error } = useResetPassword();

  const prefill = (location.state as ResetPasswordLocationState | null) ?? {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: prefill.email ?? "",
      token: prefill.token ?? "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    const { confirmNewPassword: _confirmNewPassword, ...payload } = values;

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Password reset",
          description: "You can now sign in with your new password.",
        });
        navigate("/login", { replace: true });
      },
    });
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <AuthCard
      title="Reset your password"
      description="Enter the reset token and choose a new password."
      footer={
        <Link to="/auth/login" className="text-primary underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {(fieldErrors.length > 0 || apiErrors.length > 0) && (
          <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-body text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="token" className="font-body text-sm font-medium text-foreground">
            Reset Token
          </label>
          <Input id="token" aria-invalid={Boolean(errors.token)} {...register("token")} />
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

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}
