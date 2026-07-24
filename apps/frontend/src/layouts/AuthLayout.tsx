import { Link, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

/**
 * Wraps /auth/login, /auth/register, /auth/forgot-password,
 * /auth/reset-password. The `academy` atmosphere and glowing card
 * border carry the same visual language as the Landing Page and the
 * authenticated app through into the auth forms — this is the
 * "entering the world" transition, not a plain utilitarian form
 * screen that drops the identity the moment login starts.
 *
 * Also handles the "already authenticated" redirect once, centrally,
 * rather than repeating the same check in all 4 auth pages.
 */
export function AuthLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <PageAtmosphere variant="academy" />
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
          RyuZen
        </Link>
        <ThemeToggle />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-lg border border-primary/20 bg-card/90 p-8 text-card-foreground shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)] backdrop-blur-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
