import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UIProvider } from "@/contexts/UIContext";

import { TooltipProvider } from "@/shared/ui/Tooltip";
import { Toaster } from "@/shared/ui/Toaster";

import { AppRoutes } from "@/routes/router";

/**
 * The F2 (theme swatch) and F4 (auth status) demo content that
 * previously lived here has been removed now that real routing exists
 * (F5) — there is no longer a single "/" page for it to occupy, since
 * "/" now redirects based on auth state. Both milestones' behavior was
 * already verified at the time (F2: computed WCAG contrast ratios; F4:
 * the login/refresh/logout smoke test) and did not need to remain as
 * permanent, live application code.
 *
 * TooltipProvider and Toaster (F6) are mounted once here, at the true
 * app root, rather than per-layout — a toast triggered from an Auth
 * page (before login) or a dev playground should work exactly the same
 * as one triggered from inside AppShell.
 */
export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
              <Toaster />
            </TooltipProvider>
          </UIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
