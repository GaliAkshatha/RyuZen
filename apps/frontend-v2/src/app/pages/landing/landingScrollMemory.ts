/**
 * Real scroll-position memory for the landing page, backed by
 * sessionStorage rather than router state alone - router state (what
 * ExitDemoButton originally relied on) only ever reaches LandingPage
 * when navigated to via router.navigate() with that state explicitly
 * attached. A genuine browser back/forward button restores whatever
 * state the ORIGINAL history entry had when it was first pushed
 * (typically none), so it could never carry "scroll to Explore" on
 * its own - confirmed this was the real gap behind "browser back
 * doesn't return to where I was." sessionStorage has no such
 * limitation: it's read fresh on every mount, regardless of how the
 * navigation happened.
 */
const SCROLL_KEY = "ryuzen-landing-scroll";

export function saveLandingScrollPosition(y: number): void {
  sessionStorage.setItem(SCROLL_KEY, String(y));
}

export function getLandingScrollPosition(): number | null {
  const raw = sessionStorage.getItem(SCROLL_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function clearLandingScrollPosition(): void {
  sessionStorage.removeItem(SCROLL_KEY);
}
