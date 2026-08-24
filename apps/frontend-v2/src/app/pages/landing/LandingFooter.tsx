export function LandingFooter() {
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
          <a href="#" className="transition-colors hover:text-[var(--rz-text-dim)]">
            About
          </a>
          <a href="#" className="transition-colors hover:text-[var(--rz-text-dim)]">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-[var(--rz-text-dim)]">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-[var(--rz-text-dim)]">
            Contact
          </a>
        </div>
        <p className="rz-mono text-[10.5px] text-[var(--rz-text-mute)]">© {new Date().getFullYear()} RyuZen. All rights reserved.</p>
      </div>
    </footer>
  );
}
