/**
 * One real, shared sessionStorage key marking "this session was
 * entered via a demo account" - set right before navigating into a
 * demo portal, read by ExitDemoButton (mounted once at the app root)
 * to decide whether to show a way back. sessionStorage (not
 * localStorage) is deliberate: closing the tab naturally clears it,
 * so a stray demo flag never persists into an unrelated future real
 * session on the same browser.
 */
export const DEMO_MODE_KEY = "ryuzen-demo-mode";

/**
 * A second, real, separate flag - set right when ExitDemoButton
 * begins the exit, cleared once LandingPage has actually mounted and
 * consumed it. Confirmed a genuine second bug beyond the earlier
 * navigate-then-logout ordering fix: LandingPage has its own guard
 * (`if (!isLoading && user) return <Navigate to={portal} />`) that
 * redirects an already-authenticated visitor straight back to their
 * portal - and during the brief window where the router has already
 * moved to "/" but logout() hasn't finished clearing auth state yet,
 * that guard fires and bounces the user right back to the portal
 * they were trying to leave, which (once logout() does finish)
 * ProtectedRoute then catches and redirects to /login anyway. This
 * flag lets LandingPage recognize "this is an intentional exit, not
 * a normal authenticated visit" and skip that guard for one render.
 */
export const EXITING_DEMO_KEY = "ryuzen-exiting-demo";
