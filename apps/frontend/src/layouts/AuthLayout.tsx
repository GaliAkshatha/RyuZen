import { Outlet } from "react-router-dom";

import { ThemeToggle } from "@/shared/ui/ThemeToggle";

/**
 * Wraps /login, /register, /forgot-password, /reset-password. The
 * pages themselves are still RouteStubPage placeholders until P1, but
 * the chrome around them is real — a centered card on a quiet
 * background, matching the Dark Fantasy Academy identity without
 * competing with whatever form P1 puts inside.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-6">
        <span className="font-display text-xl font-semibold tracking-tight">RyuZen</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
