import { RouterProvider } from "react-router-dom";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeContext";
import { AuthProvider } from "@/domains/auth/AuthContext";
import { router } from "@/app/router/router";
import { ExitDemoButton } from "@/app/pages/landing/ExitDemoButton";

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ExitDemoButton />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
