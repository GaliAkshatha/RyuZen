import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import { navRegistry } from "@/shared/constants/navRegistry";
import { UserRole } from "@/types/enums";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { RoleLayoutSwitch } from "@/routes/RoleLayoutSwitch";
import { DashboardRoleSwitch } from "@/routes/DashboardRoleSwitch";
import { RouteStubPage } from "@/routes/pages/RouteStubPage";
import { ForbiddenPage } from "@/routes/pages/ForbiddenPage";
import { NotFoundPage } from "@/routes/pages/NotFoundPage";
import { PlaygroundPage } from "@/routes/pages/PlaygroundPage";
import { CompositePlaygroundPage } from "@/routes/pages/CompositePlaygroundPage";

import { AuthLayout } from "@/layouts/AuthLayout";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { ChangePasswordPage } from "@/features/profile/pages/ChangePasswordPage";

import { DepartmentListPage } from "@/features/departments/pages/DepartmentListPage";
import { DepartmentDetailPage } from "@/features/departments/pages/DepartmentDetailPage";
import { FacultyListPage } from "@/features/faculty/pages/FacultyListPage";
import { FacultyDetailPage } from "@/features/faculty/pages/FacultyDetailPage";

import { StudentListPage } from "@/features/students/pages/StudentListPage";
import { StudentDetailPage } from "@/features/students/pages/StudentDetailPage";

import { AlumniListPage } from "@/features/alumni/pages/AlumniListPage";
import { AlumniDetailPage } from "@/features/alumni/pages/AlumniDetailPage";
import { InviteAlumniPage } from "@/features/alumni/pages/InviteAlumniPage";

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

      {/* Public routes, wrapped in the real AuthLayout (F8), now with
          real forms (P1). */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Dev-only: verifies primitives/composites render correctly in
          both themes. Not linked from any nav, not auth-gated. */}
      <Route path="/dev/playground" element={<PlaygroundPage />} />
      <Route path="/dev/playground-composites" element={<CompositePlaygroundPage />} />

      {/* Every authenticated route: ProtectedRoute gates on auth,
          RoleLayoutSwitch (F8) picks the layout for the user's role,
          and every child route below is generated directly from
          navRegistry so the route tree and the sidebar can never
          disagree about who can access what. */}
      <Route
        element={
          <ProtectedRoute>
            <RoleLayoutSwitch />
          </ProtectedRoute>
        }
      >
        {navRegistry
          .filter(
            (item) =>
              ![
                "/app/profile",
                "/app/dashboard",
                "/app/admin/departments",
                "/app/admin/faculty",
                "/app/admin/students",
                "/app/admin/alumni",
              ].includes(item.path),
          )
          .map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <RoleRoute allowedRoles={item.roles}>
                  <RouteStubPage title={item.label} />
                </RoleRoute>
              }
            />
          ))}

        {/* Real pages — /app/dashboard (D1) and /app/profile (P2) are
            both in navRegistry (all roles) but rendered explicitly
            here instead of through the generic stub map above. */}
        <Route path="/app/dashboard" element={<DashboardRoleSwitch />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/profile/change-password" element={<ChangePasswordPage />} />

        {/* Departments & Faculty (A1) — real pages, matching
            navRegistry's [SUPER_ADMIN, ORG_ADMIN] role list exactly. */}
        <Route
          path="/app/admin/departments"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <DepartmentListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/departments/:id"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <DepartmentDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/faculty"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <FacultyListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/faculty/:id"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <FacultyDetailPage />
            </RoleRoute>
          }
        />

        {/* Students (A2) — real pages, [SUPER_ADMIN, ORG_ADMIN] only.
            The roadmap's own A2 text assumed Faculty read-access, but
            student.routes.ts is confirmed SUPER_ADMIN/ORG_ADMIN-only on
            every route including GET — the same finding F5 already
            made and encoded in navRegistry.ts. Followed backend truth
            here rather than the roadmap's assumption. */}
        <Route
          path="/app/admin/students"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <StudentListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/students/:id"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <StudentDetailPage />
            </RoleRoute>
          }
        />

        {/* Alumni (A3) — real pages, [SUPER_ADMIN, ORG_ADMIN] only. The
            roadmap's own A3 text assumed a public/cross-role directory
            ("also read-visible under AlumniLayout/StudentLayout/
            FacultyLayout"), but alumni.routes.ts is confirmed
            SUPER_ADMIN/ORG_ADMIN-only on every route including GET —
            re-verified against the backend this milestone, the same
            finding F5 already made and encoded in navRegistry.ts. No
            "/app/alumni" browsing route exists, since no backend
            endpoint would back it. Verify itself is further restricted
            to ORG_ADMIN alone (excluding SUPER_ADMIN) inside
            VerifyAlumniAction.tsx, matching the one route-level
            asymmetry that genuinely exists. */}
        <Route
          path="/app/admin/alumni"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <AlumniListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/alumni/invite"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <InviteAlumniPage />
            </RoleRoute>
          }
        />
        <Route
          path="/app/admin/alumni/:id"
          element={
            <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
              <AlumniDetailPage />
            </RoleRoute>
          }
        />

        {detailStubRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<RouteStubPage title={title} />} />
        ))}
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
