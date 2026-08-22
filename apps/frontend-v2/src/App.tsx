import { RouterProvider } from "react-router-dom";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeContext";
import { AuthProvider } from "@/domains/auth/AuthContext";
import { router } from "@/app/router/router";

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
