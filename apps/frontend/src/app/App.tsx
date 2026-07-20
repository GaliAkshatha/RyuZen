import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

/**
 * Temporary root page for Milestones F1–F4.
 *
 * Real routing, layouts, and pages are built in later milestones (F5
 * Routing Foundation, F8 Application Shell, P1 Auth Pages). The auth
 * status line below proves AuthContext is live end-to-end (hydration,
 * isAuthenticated) without building an actual login form here — that is
 * explicitly P1's scope, not F4's.
 */
function ScaffoldingPlaceholder() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground transition-colors">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-semibold tracking-tight">RyuZen</h1>
          <ThemeToggle />
        </header>

        <p className="font-body text-base text-muted-foreground">
          Project scaffolding, the design token system, and the API/auth layer are wired and
          running.
        </p>

        <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
          <h2 className="font-display text-xl font-medium">Token swatch preview</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            <Swatch label="Primary" className="bg-primary text-primary-foreground" />
            <Swatch label="Secondary" className="bg-secondary text-secondary-foreground" />
            <Swatch label="Accent" className="bg-accent text-accent-foreground" />
            <Swatch label="Success" className="bg-success text-success-foreground" />
            <Swatch label="Warning" className="bg-warning text-warning-foreground" />
            <Swatch label="Destructive" className="bg-destructive text-destructive-foreground" />
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            font-display · font-body · font-mono
          </p>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
          <h2 className="font-display text-xl font-medium">Auth status</h2>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            {isInitializing
              ? "Checking for a stored session…"
              : isAuthenticated
                ? `Signed in as ${user?.name} (${user?.role})`
                : "Not signed in. Login pages arrive in Milestone P1."}
          </p>
        </section>
      </div>
    </div>
  );
}

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`flex h-16 flex-col items-center justify-center rounded-md text-xs ${className}`}
    >
      {label}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ScaffoldingPlaceholder />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
