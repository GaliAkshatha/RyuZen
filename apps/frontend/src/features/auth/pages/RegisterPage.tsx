import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerFormSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schemas";

export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { organizationCode: "", name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterFormValues) {
    // confirmPassword is a client-only field, never sent to the backend
    // (RegisterPayload has no such field — see auth.types.ts).
    const { confirmPassword: _confirmPassword, ...payload } = values;

    mutate(payload, {
      onSuccess: () => {
        toast({ title: "Account created", description: "You can now sign in." });
        navigate("/login", { state: { prefillEmail: payload.email }, replace: true });
      },
    });
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <AuthCard
      title="Create your account"
      description="Join your organization on RyuZen"
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {(fieldErrors.length > 0 || apiErrors.length > 0) && (
          <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="organizationCode"
            className="font-body text-sm font-medium text-foreground"
          >
            Organization Code
          </label>
          <Input
            id="organizationCode"
            autoComplete="organization"
            aria-invalid={Boolean(errors.organizationCode)}
            {...register("organizationCode")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </div>

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
          <label
            htmlFor="confirmPassword"
            className="font-body text-sm font-medium text-foreground"
          >
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

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
