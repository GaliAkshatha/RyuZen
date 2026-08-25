import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

import { useAuth } from "@/domains/auth/AuthContext";
import { DEMO_MODE_KEY, EXITING_DEMO_KEY } from "@/app/pages/landing/demoModeFlag";
import { router } from "@/app/router/router";

/**
 * Mounted once at the app root (see App.tsx) - deliberately not
 * added to each of the 7 portal layouts individually, since it needs
 * to appear identically regardless of which real portal the demo
 * session landed in. Only ever renders when the current session was
 * genuinely entered via a demo account (DEMO_MODE_KEY, set by
 * useDemoLogin right before navigating) - a real logged-in user who
 * signed in normally never sees this.
 *
 * Real client-side navigation via the router instance directly
 * (not window.location.href) - a hard reload was a confirmed real
 * cause of "returns to the top of the page, replays the whole intro"
 * (verified against an actual recorded session). ExitDemoButton sits
 * outside the Router's component tree (a sibling of RouterProvider
 * in App.tsx, so it has no useNavigate() context) - the exported
 * router instance's own imperative .navigate() is the real, correct
 * way to navigate from here.
 *
 * The actual fix for "still lands on /login" required both changes
 * together, confirmed by tracing the full sequence - neither alone
 * was sufficient:
 *
 * 1. Awaiting the navigation to "/" BEFORE calling logout() - if
 *    logout() ran first, ProtectedRoute (still wrapping the OLD
 *    portal route at that instant) would reactively fire its own
 *    <Navigate to="/login">, racing this component's explicit
 *    navigate() call, and evidently winning often enough to be the
 *    reported bug.
 *
 * 2. EXITING_DEMO_KEY - even with (1), LandingPage mounts at "/"
 *    while the user may still be (briefly) authenticated, since
 *    logout() hasn't run yet. LandingPage has its own guard
 *    ("if authenticated, redirect to my portal") that would fire in
 *    that exact window, bouncing back to the portal - which
 *    ProtectedRoute then catches once logout() finally clears auth
 *    state, landing on /login anyway. This flag tells that one
 *    render to skip the guard. See LandingPage.tsx.
 */
export function ExitDemoButton() {
  const { logout, isAuthenticated } = useAuth();
  const [isDemoSession, setIsDemoSession] = useState(false);

  useEffect(() => {
    setIsDemoSession(sessionStorage.getItem(DEMO_MODE_KEY) === "true");
  }, [isAuthenticated]);

  if (!isDemoSession || !isAuthenticated) return null;

  async function exitDemo() {
    sessionStorage.removeItem(DEMO_MODE_KEY);
    sessionStorage.setItem(EXITING_DEMO_KEY, "true");
    await router.navigate("/", { state: { skipIntro: true } });
    logout();
  }

  return (
    <button
      onClick={exitDemo}
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5"
      style={{
        background: "rgba(11,14,20,.92)",
        borderColor: "#2a3040",
        color: "#edeff4",
      }}
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      Exit demo
    </button>
  );
}
