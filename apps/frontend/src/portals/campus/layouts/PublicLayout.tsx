import { Outlet } from "react-router-dom";

/**
 * No public/marketing pages exist yet in the route tree — "/" always
 * redirects based on auth state (see router.tsx's RootRedirect). This
 * layout exists as the architectural placeholder named in
 * 01_Frontend_Architecture.md for whenever one is added, deliberately
 * with no chrome to assume as little as possible about what a future
 * public page needs.
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
