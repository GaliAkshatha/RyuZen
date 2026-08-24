import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/domains/auth/AuthContext";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";
import { DEMO_ACCOUNTS, type DemoRole } from "@/app/pages/landing/demoAccounts";
import { DEMO_MODE_KEY } from "@/app/pages/landing/demoModeFlag";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Reuses the exact real login() from AuthContext - the same function
 * the real login form calls. Not a fake or read-only demo mode: this
 * is a genuine authenticated session against a real seeded account,
 * just entered with one click instead of typing credentials. If a
 * demo account is ever deleted or its password changed outside of
 * this app, the real backend's own real error message surfaces here
 * unchanged - this hook adds no fake success path.
 */
export function useDemoLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [pendingRole, setPendingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function enterAs(role: DemoRole) {
    setError(null);
    setPendingRole(role);
    try {
      const account = DEMO_ACCOUNTS[role];
      const profile = await login({ email: account.email, password: account.password });
      sessionStorage.setItem(DEMO_MODE_KEY, "true");
      navigate(getPortalPathForRole(profile.role), { replace: true });
    } catch (err) {
      const apiError = err as AppApiError;
      // A genuine network-level failure (no real response from the
      // backend at all) normalizes to statusCode 0 with message set
      // to axios's own literal "Network Error" string - confirmed
      // directly in apiClient's normalizeError. That raw string must
      // never reach a public visitor on the landing page; only a real
      // backend response (a real statusCode) has an actually
      // trustworthy, user-appropriate message.
      const friendlyMessage =
        apiError.statusCode && apiError.statusCode > 0
          ? apiError.message
          : "The demo is temporarily unavailable. Please try again in a moment.";
      setError(friendlyMessage);
    } finally {
      setPendingRole(null);
    }
  }

  return { enterAs, pendingRole, error };
}
