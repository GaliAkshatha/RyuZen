import { useAuth } from "@/domains/auth/AuthContext";
import { Button } from "@/shared/ui/Button";

/**
 * Real, temporary landing page proving the full auth flow end-to-end
 * (login -> token storage -> profile fetch -> role-based redirect ->
 * protected render) before any actual portal is built. Each role's
 * real portal replaces this one individually in later phases - this
 * is not meant to be mistaken for a finished dashboard.
 */
export function PortalPlaceholderPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-muted-foreground">Signed in as</p>
      <p className="text-lg font-semibold text-foreground">{user?.name}</p>
      <p className="text-xs text-muted-foreground">{user?.role}</p>
      <p className="mt-2 max-w-sm text-xs text-muted-foreground">
        This is a temporary placeholder confirming the real auth flow works. The actual portal for
        this role is built in a later phase.
      </p>
      <Button size="sm" variant="outline" onClick={logout} className="mt-2">
        Log out
      </Button>
    </div>
  );
}
