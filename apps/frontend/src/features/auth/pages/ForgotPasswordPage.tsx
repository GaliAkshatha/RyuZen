import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    mutate(values, {
      onSuccess: (result) => {
        setSubmittedEmail(values.email);
        setDevResetToken(result.resetToken ?? null);
      },
    });
  }

  const fieldErrors = errors.email ? [`Email: ${errors.email.message}`] : [];
  const apiErrors = flattenApiErrors(error);

  if (submittedEmail) {
    return (
      <AuthCard
        title="Check your email"
        description={`If an account exists for ${submittedEmail}, password reset instructions have been generated.`}
        footer={
          <Link to="/auth/login" className="text-primary underline underline-offset-4">
            Back to sign in
          </Link>
        }
      >
        {devResetToken && (
          <div className="flex flex-col gap-3 rounded-md border border-warning/40 bg-warning/5 p-3">
            <p className="flex items-center gap-2 font-body text-xs font-medium text-warning">
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              Development mode
            </p>
            <p className="font-body text-xs text-muted-foreground">
              No email delivery is configured on the backend yet, so the reset token is shown here
              directly instead of being emailed. This will not happen in production.
            </p>
            <code className="break-all rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
              {devResetToken}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate("/reset-password", {
                  state: { email: submittedEmail, token: devResetToken },
                })
              }
            >
              Continue to reset password
            </Button>
          </div>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll help you reset it."
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

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Sending…" : "Send reset instructions"}
        </Button>
      </form>
    </AuthCard>
  );
}
