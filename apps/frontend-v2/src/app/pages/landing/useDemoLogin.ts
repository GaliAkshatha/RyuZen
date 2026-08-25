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
      // Deliberately a real push, not replace:true (unlike the real
      // login form, where replace is correct - you don't want "back"
      // reopening a stale login form). A demo is an exploration, not
      // a one-way commitment: the landing page must stay in history
      // so browser back genuinely returns to it. Confirmed this was
      // the real cause of "back button goes to /login instead of the
      // landing page" - replace:true was removing "/" from history
      // entirely, so back skipped past it to whatever page came
      // before it in the user's real session.
      navigate(getPortalPathForRole(profile.role));
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
