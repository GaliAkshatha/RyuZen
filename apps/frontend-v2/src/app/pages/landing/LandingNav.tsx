import { Link } from "react-router-dom";

/**
 * Reveal is driven by the parent (LandingPage), which is told when to
 * flip it by HeroExperience's GSAP timeline (or its Skip button) -
 * not a second, independently-timed animation that could drift out
 * of sync with the intro.
 */
export function LandingNav({ visible }: { visible: boolean }) {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 transition-opacity duration-700 sm:px-10"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Link to="/" className="rz-display flex items-center gap-2 text-[15px] font-bold tracking-wide text-[var(--rz-text)]">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold"
          style={{ borderColor: "var(--rz-eye)", background: "var(--rz-ink-2)", color: "var(--rz-eye)" }}
        >
          R
        </span>
        RyuZen
      </Link>
      <div className="hidden items-center gap-8 text-[12.5px] text-[var(--rz-text-dim)] sm:flex">
        <a href="#paths" className="transition-colors hover:text-[var(--rz-eye)]">
          Paths
        </a>
        <a href="#intelligence" className="transition-colors hover:text-[var(--rz-eye)]">
          Intelligence
        </a>
        <a href="#explore" className="transition-colors hover:text-[var(--rz-eye)]">
          Explore
        </a>
      </div>
      <div className="flex items-center gap-2.5">
        <Link to="/login" className="rounded px-3.5 py-2 text-[12.5px] font-semibold text-[var(--rz-text)] transition-colors hover:text-[var(--rz-eye)]">
          Log in
        </Link>
        <Link
          to="/login"
          className="rounded px-4 py-2 text-[12.5px] font-semibold"
          style={{ background: "var(--rz-eye)", color: "#04262e" }}
        >
          Begin
        </Link>
      </div>
    </nav>
  );
}
