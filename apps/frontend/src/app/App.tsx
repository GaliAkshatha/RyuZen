import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

function ScaffoldingPlaceholder() {
  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground transition-colors">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-semibold tracking-tight">RyuZen</h1>
          <ThemeToggle />
        </header>

        <p className="font-body text-base text-muted-foreground">
          Project scaffolding and the design token system are wired and running.
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ScaffoldingPlaceholder />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
