import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

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

/**
 * Simplified once real SMTP email delivery existed on the backend
 * (NodemailerEmailService) — this used to show the raw reset token
 * directly on the page as an explicitly-labeled "Development mode"
 * workaround, because the backend had no way to email it and was
 * returning it directly in the API response instead (a real
 * account-takeover risk: anyone could fetch a valid reset token for
 * any email with no inbox access at all). The backend no longer
 * returns the token in the response under any circumstance; this page
 * only ever shows the generic "check your email" confirmation now.
 */
export function ForgotPasswordPage() {
  const { mutate, isPending, error } = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

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
      onSuccess: () => setSubmittedEmail(values.email),
    });
  }

  const fieldErrors = errors.email ? [`Email: ${errors.email.message}`] : [];
  const apiErrors = flattenApiErrors(error);

  if (submittedEmail) {
    return (
      <AuthCard
        title="Check your email"
        description={`If an account exists for ${submittedEmail}, we've sent password reset instructions to that address.`}
        footer={
          <Link to="/auth/login" className="text-primary underline underline-offset-4">
            Back to sign in
          </Link>
        }
      />
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you reset instructions."
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
