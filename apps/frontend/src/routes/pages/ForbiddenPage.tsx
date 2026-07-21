import { Link } from "react-router-dom";

/**
 * Minimal 403 page. ProtectedRoute/RoleRoute need a real redirect
 * target today, so this exists now, but the polished version (styling,
 * illustration, etc.) is H2's explicit deliverable (Global State Audit
 * & Error Pages) — this is intentionally bare-bones, not a finished page.
 */
export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
      <h1 className="font-display text-3xl font-semibold">403 — Access Denied</h1>
      <p className="font-body text-muted-foreground">
        Your role does not have access to this section.
      </p>
      <Link to="/app/dashboard" className="font-body text-primary underline underline-offset-4">
        Back to dashboard
      </Link>
    </div>
  );
}
