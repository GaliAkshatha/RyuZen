import { useNavigate } from "react-router-dom";

/**
 * Reverted to the simpler single-row footer per explicit request -
 * the multi-column redesign was more than was wanted here. Links
 * that go somewhere real (Learn more, Explore) still use real
 * navigation, not dead hrefs.
 */
export function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative border-t px-6 py-8" style={{ borderColor: "var(--rz-mist-soft)", background: "var(--rz-void)" }}>
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="rz-display flex items-center gap-2 text-[13px] font-bold text-[var(--rz-text-dim)]">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold"
            style={{ borderColor: "var(--rz-mist)", color: "var(--rz-text-mute)" }}
          >
            R
          </span>
          RyuZen
        </div>
        <div className="flex items-center gap-6 text-[11.5px] text-[var(--rz-text-mute)]">
          <button type="button" onClick={() => navigate("/learn-more")} className="transition-colors hover:text-[var(--rz-text-dim)]">
            About
          </button>
          <span>Privacy</span>
          <span>Terms</span>
          <a href="mailto:hello@ryuzen.app" className="transition-colors hover:text-[var(--rz-text-dim)]">
            Contact
          </a>
        </div>
        <p className="rz-mono text-[10.5px] text-[var(--rz-text-mute)]">© {new Date().getFullYear()} RyuZen. All rights reserved.</p>
      </div>
    </footer>
  );
}
