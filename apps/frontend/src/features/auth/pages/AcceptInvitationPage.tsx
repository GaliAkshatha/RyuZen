import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/components/Spinner";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { useVerifyInvitation } from "@/features/auth/hooks/useVerifyInvitation";
import { useAcceptInvitation } from "@/features/auth/hooks/useAcceptInvitation";
import {
  acceptInvitationFormSchema,
  type AcceptInvitationFormValues,
} from "@/features/auth/schemas/auth.schemas";

/**
 * The real link ORG_ADMIN's invitation email points to:
 * `/auth/accept-invitation?email=...&token=...`. Verifying on mount
 * has a real backend side effect — it transitions the account from
 * INVITED to EMAIL_VERIFIED, since arriving here at all could only
 * happen via the emailed link. Submitting the form transitions
 * EMAIL_VERIFIED to ACTIVE.
 */
export function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const { mutate: verify, isPending: isVerifying, isSuccess, data, error: verifyError } = useVerifyInvitation();
  const { mutate: accept, isPending: isAccepting, error: acceptError } = useAcceptInvitation();

  useEffect(() => {
    if (email && token) {
      verify({ email, token });
    }
    // Only run once on mount with the URL's real values - re-verifying
    // on every render would keep re-triggering the same real status
    // transition unnecessarily.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationFormSchema),
    defaultValues: { email, token, password: "", confirmPassword: "" },
  });

  function onSubmit(values: AcceptInvitationFormValues) {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    accept(payload, {
      onSuccess: () => {
        toast({ title: "Account activated", description: "You can now sign in." });
        navigate("/auth/login", { replace: true });
      },
    });
  }

  if (!email || !token) {
    return (
      <AuthCard
        title="Invalid invitation link"
        description="This link is missing required information. Please use the link from your invitation email exactly as sent."
        footer={
          <Link to="/auth/login" className="text-primary underline underline-offset-4">
            Back to sign in
          </Link>
        }
      />
    );
  }

  if (isVerifying) {
    return (
      <AuthCard title="Verifying your invitation…">
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      </AuthCard>
    );
  }

  if (verifyError) {
    return (
      <AuthCard
        title="This invitation link is invalid or has expired"
        description="Ask your organization administrator to resend your invitation."
        footer={
          <Link to="/auth/login" className="text-primary underline underline-offset-4">
            Back to sign in
          </Link>
        }
      />
    );
  }

  const fieldErrors = Object.entries(errors)
    .filter(([field]) => field === "password" || field === "confirmPassword")
    .map(([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`);
  const apiErrors = flattenApiErrors(acceptError);

  return (
    <AuthCard
      title={isSuccess && data ? `Welcome, ${data.name.split(" ")[0]}` : "Set your password"}
      description={
        isSuccess && data
          ? `Create a password to activate your ${data.organizationName} account as ${data.role.toLowerCase()}.`
          : undefined
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="font-body text-xs text-muted-foreground">
            Your invitation is verified — you're one step away from joining.
          </p>
        </div>

        {(fieldErrors.length > 0 || apiErrors.length > 0) && (
          <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
        )}

        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("token")} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="font-body text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <p className="font-body text-xs text-muted-foreground">
            At least 8 characters, with an uppercase letter, lowercase letter, number, and special
            character.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="font-body text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </div>

        <Button type="submit" disabled={isAccepting} className="mt-2">
          {isAccepting ? "Activating…" : "Activate Account"}
        </Button>
      </form>
    </AuthCard>
  );
}
