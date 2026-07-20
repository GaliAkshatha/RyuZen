import { Link } from "react-router-dom";

/**
 * Minimal 404 page — same rationale as ForbiddenPage. The catch-all
 * route needs a real destination today; H2 polishes this later.
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
      <h1 className="font-display text-3xl font-semibold">404 — Page Not Found</h1>
      <p className="font-body text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="font-body text-primary underline underline-offset-4">
        Back to home
      </Link>
    </div>
  );
}
