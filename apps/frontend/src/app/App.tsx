import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import { AppRoutes } from "@/routes/router";

/**
 * The F2 (theme swatch) and F4 (auth status) demo content that
 * previously lived here has been removed now that real routing exists
 * (F5) — there is no longer a single "/" page for it to occupy, since
 * "/" now redirects based on auth state. Both milestones' behavior was
 * already verified at the time (F2: computed WCAG contrast ratios; F4:
 * the login/refresh/logout smoke test) and did not need to remain as
 * permanent, live application code.
 */
export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
