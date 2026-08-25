import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

import { useAuth } from "@/domains/auth/AuthContext";
import { DEMO_MODE_KEY } from "@/app/pages/landing/demoModeFlag";
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
 * (not window.location.href) - a hard reload was the confirmed real
 * cause of "returns to the top of the page, replays the whole intro"
 * (verified against an actual recorded session): a full page reload
 * re-mounts everything from scratch and a browser's native
 * hash-scroll-on-load cannot reliably land inside a React SPA whose
 * layout is still settling. ExitDemoButton sits outside the Router's
 * component tree (a sibling of RouterProvider in App.tsx, so it has
 * no useNavigate() context) - the exported router instance's own
 * imperative .navigate() is the real, correct way to navigate from
 * here. The real navigation state (skipIntro) is read by
 * LandingPage to skip the GSAP intro replay and land exactly back on
 * the Explore section, not the top of the page.
 *
 * Order matters here, confirmed against a real bug: calling logout()
 * before the navigation to "/" completed created a genuine race
 * against ProtectedRoute, which wraps every portal route and
 * reactively redirects to /login the instant isAuthenticated becomes
 * false. logout() updates auth state synchronously, so the OLD
 * portal route (still mounted at that moment) would see
 * isAuthenticated flip to false and fire its own <Navigate
 * to="/login"> - competing with this component's explicit navigate()
 * call, and evidently winning. Fixed by awaiting the navigation to
 * "/" (a public route, no ProtectedRoute wrapping it) BEFORE calling
 * logout() - by the time auth state changes, the old portal's
 * ProtectedRoute is already unmounted and never gets a chance to
 * react at all.
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
