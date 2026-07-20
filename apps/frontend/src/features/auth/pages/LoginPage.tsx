import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schemas";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const redirectTo =
    (location.state as { from?: Location } | null)?.from?.pathname ?? "/app/dashboard";

  function onSubmit(values: LoginFormValues) {
    mutate(values, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
    });
  }

  const fieldErrors = [
    ...(errors.email ? [`Email: ${errors.email.message}`] : []),
    ...(errors.password ? [`Password: ${errors.password.message}`] : []),
  ];
  const apiErrors = flattenApiErrors(error);

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your RyuZen account"
      footer={
        <div className="flex flex-col gap-2">
          <Link to="/forgot-password" className="text-primary underline underline-offset-4">
            Forgot your password?
          </Link>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary underline underline-offset-4">
              Register
            </Link>
          </p>
        </div>
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
          <label htmlFor="password" className="font-body text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
