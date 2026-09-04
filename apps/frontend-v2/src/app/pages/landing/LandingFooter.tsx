import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

/**
 * Compact LandingFooter:
 * - Minimal, low-profile footprint (py-3.5)
 * - Brand emblem, quick links, copyright, and scroll-to-top button
 */
export function LandingFooter() {
  const navigate = useNavigate();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      className="relative border-t px-6 py-3.5 sm:py-4"
      style={{ borderColor: "var(--rz-mist-soft)", background: "var(--rz-void)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Brand */}
        <div className="rz-display flex items-center gap-2 text-[12.5px] font-bold text-[var(--rz-text)]">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold"
            style={{ borderColor: "var(--rz-eye)", color: "var(--rz-eye)", background: "var(--rz-ink-2)" }}
          >
            R
          </span>
          <span>RyuZen</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 text-[11.5px] text-[var(--rz-text-dim)]">
          <button
            type="button"
            onClick={() => navigate("/learn-more")}
            className="transition-colors hover:text-[var(--rz-eye)]"
          >
            About
          </button>
          <a
            href="#paths"
            className="transition-colors hover:text-[var(--rz-eye)]"
          >
            Paths
          </a>
          <a
            href="#explore"
            className="transition-colors hover:text-[var(--rz-eye)]"
          >
            Demo
          </a>
          <a
            href="mailto:hello@ryuzen.app"
            className="transition-colors hover:text-[var(--rz-eye)]"
          >
            Contact
          </a>
        </div>

        {/* Copyright & Back to Top */}
        <div className="flex items-center gap-3">
          <p className="rz-mono text-[10.5px] text-[var(--rz-text-mute)]">
            © {new Date().getFullYear()} RyuZen
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--rz-mist)] bg-[var(--rz-ink-2)] text-[var(--rz-text-dim)] transition-all hover:border-[var(--rz-eye)] hover:text-[var(--rz-eye)] hover:scale-105"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
