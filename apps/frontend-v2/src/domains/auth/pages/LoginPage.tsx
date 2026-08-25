import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { useAuth } from "@/domains/auth/AuthContext";
import { loginSchema, type LoginFormValues } from "@/domains/auth/loginSchema";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real submit flow: login() returns the fresh profile directly (not
 * read from context state, which wouldn't have re-rendered yet in
 * this same function), so the redirect target is computed from
 * genuinely current data. Redirects to wherever the user was
 * originally headed (ProtectedRoute's `state.from`) if that exists,
 * otherwise their real role's portal path.
 */
export function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // A real gap otherwise: visiting /login directly while already
  // authenticated (e.g. a stale bookmark, or clicking back) would
  // show the form again instead of taking the user where they
  // already are. Session resolution (isLoading) must finish first,
  // or this would fire on every fresh page load before auth state is
  // known.
  if (!isLoading && user) {
    return <Navigate to={getPortalPathForRole(user.role)} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    try {
      const profile = await login(values);
      const from = (location.state as { from?: Location })?.from;
      navigate(from?.pathname ?? getPortalPathForRole(profile.role), { replace: true });
    } catch (error) {
      // Show the backend's own real message directly - a 401 here
      // means wrong credentials, a 403 could mean a suspended
      // account; both are already correctly worded by the backend
      // itself and must not be reinterpreted the way the generic
      // ErrorState component does for already-authenticated calls.
      const apiError = error as AppApiError;
      setSubmitError(apiError.message || "Unable to sign in. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center gap-3 px-6 py-5">
        <Link
          to="/"
          aria-label="Back to RyuZen"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link to="/" className="flex items-center gap-2 text-[15px] font-bold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-[11px] font-bold text-primary">
            R
          </span>
          RyuZen
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-20">
        <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>RyuZen</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {submitError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-1">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
