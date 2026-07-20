import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import { navRegistry } from "@/shared/constants/navRegistry";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { RouteStubPage } from "@/routes/pages/RouteStubPage";
import { ForbiddenPage } from "@/routes/pages/ForbiddenPage";
import { NotFoundPage } from "@/routes/pages/NotFoundPage";
import { PlaygroundPage } from "@/routes/pages/PlaygroundPage";

/**
 * "/" redirects based on auth state, per the approved route tree.
 * Waits out isInitializing the same way ProtectedRoute does, to avoid
 * bouncing a returning user through /login before hydration finishes.
 */
function RootRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />;
}

/**
 * A handful of `:id` detail routes from the approved route tree that
 * aren't top-level nav sections (so they don't appear in navRegistry)
 * but still need to exist in the skeleton. Each mirrors the role list
 * of its parent list page — all three parent list pages (Clubs, Events,
 * Activities) are open to every role, so their detail pages are too.
 */
const detailStubRoutes: { path: string; title: string }[] = [
  { path: "/app/clubs/:id", title: "Club Detail" },
  { path: "/app/events/:id", title: "Event Detail" },
  { path: "/app/activities/:id", title: "Activity Detail" },
];

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes — stubs for now, replaced with real pages in P1 */}
      <Route path="/login" element={<RouteStubPage title="Login" />} />
      <Route path="/register" element={<RouteStubPage title="Register" />} />
      <Route path="/forgot-password" element={<RouteStubPage title="Forgot Password" />} />
      <Route path="/reset-password" element={<RouteStubPage title="Reset Password" />} />

      {/* Dev-only: verifies all F6 primitives render correctly in both
          themes. Not linked from any nav, not auth-gated — a
          verification tool, not a feature page. */}
      <Route path="/dev/playground" element={<PlaygroundPage />} />

      {/* Every nav section, generated directly from navRegistry so the
          route tree and the sidebar can never disagree about who can
          access what. */}
      {navRegistry.map((item) => (
        <Route
          key={item.path}
          path={item.path}
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={item.roles}>
                <RouteStubPage title={item.label} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      ))}

      {detailStubRoutes.map(({ path, title }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <RouteStubPage title={title} />
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
