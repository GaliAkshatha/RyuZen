import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";

/**
 * Enhanced LandingNav:
 * - Scroll-aware frosted glassmorphism on scroll
 * - Active scroll spy tracking visible sections
 * - Responsive mobile drawer for smaller screens
 * - Retains the synchronized GSAP reveal driven by LandingPage
 */
export function LandingNav({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollToTarget(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);

      // Scroll spy for current section
      const sections = ["paths", "intelligence", "explore"];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-[rgba(125,232,255,0.1)] bg-[rgba(5,6,10,0.85)] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "bg-transparent py-4.5"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="flex items-center justify-between px-6 sm:px-10">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold shadow-[0_0_12px_rgba(125,232,255,0.25)] transition-shadow group-hover:shadow-[0_0_18px_rgba(125,232,255,0.5)]"
            style={{
              borderColor: "var(--rz-eye)",
              background: "var(--rz-ink-2)",
              color: "var(--rz-eye)",
            }}
          >
            R
          </span>
          <span className="rz-display text-[15.5px] font-bold tracking-wider text-[var(--rz-text)]">
            RyuZen
          </span>
        </Link>

        {/* Desktop Nav Links with Active Indicator - text-shadow added
            deliberately: the header is bg-transparent with no
            backdrop-blur before the user scrolls, so this text sits
            directly on the bright hero artwork with nothing else
            helping contrast. */}
        <nav
          className="hidden items-center gap-9 text-[13px] font-medium text-[var(--rz-text-dim)] md:flex"
          aria-label="Main Navigation"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.85)" }}
        >
          <a
            href="#paths"
            onClick={(e) => scrollToTarget(e, "paths")}
            className={`relative py-1 transition-colors hover:text-[var(--rz-eye)] ${
              activeSection === "paths" ? "text-[var(--rz-eye)] font-semibold" : ""
            }`}
          >
            Paths
            {activeSection === "paths" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[var(--rz-eye)] shadow-[0_0_8px_var(--rz-eye)]" />
            )}
          </a>
          <a
            href="#intelligence"
            onClick={(e) => scrollToTarget(e, "intelligence")}
            className={`relative py-1 transition-colors hover:text-[var(--rz-eye)] ${
              activeSection === "intelligence" ? "text-[var(--rz-eye)] font-semibold" : ""
            }`}
          >
            Intelligence
            {activeSection === "intelligence" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[var(--rz-eye)] shadow-[0_0_8px_var(--rz-eye)]" />
            )}
          </a>
          <a
            href="#explore"
            onClick={(e) => scrollToTarget(e, "explore")}
            className={`relative py-1 transition-colors hover:text-[var(--rz-eye)] ${
              activeSection === "explore" ? "text-[var(--rz-eye)] font-semibold" : ""
            }`}
          >
            Explore
            {activeSection === "explore" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[var(--rz-eye)] shadow-[0_0_8px_var(--rz-eye)]" />
            )}
          </a>
          <Link
            to="/learn-more"
            className="transition-colors hover:text-[var(--rz-eye)]"
          >
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-md px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--rz-text-dim)] transition-colors hover:text-[var(--rz-text)] sm:inline-block"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.85)" }}
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="relative flex items-center gap-1.5 overflow-hidden rounded-md px-4 py-2 text-[12.5px] font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(125,232,255,0.4)]"
            style={{
              background: "var(--rz-eye)",
              color: "#04262e",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
            <span>Begin</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--rz-mist)] bg-[var(--rz-ink-2)] text-[var(--rz-text)] transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--rz-mist)] bg-[rgba(5,6,10,0.96)] px-6 py-5 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-[var(--rz-text)]">
            <a
              href="#paths"
              onClick={(e) => {
                scrollToTarget(e, "paths");
                setMobileMenuOpen(false);
              }}
              className="py-1 transition-colors hover:text-[var(--rz-eye)]"
            >
              Paths & Roles
            </a>
            <a
              href="#intelligence"
              onClick={(e) => {
                scrollToTarget(e, "intelligence");
                setMobileMenuOpen(false);
              }}
              className="py-1 transition-colors hover:text-[var(--rz-eye)]"
            >
              The Intelligence Layer
            </a>
            <a
              href="#explore"
              onClick={(e) => {
                scrollToTarget(e, "explore");
                setMobileMenuOpen(false);
              }}
              className="py-1 transition-colors hover:text-[var(--rz-eye)]"
            >
              Interactive Demo
            </a>
            <Link
              to="/learn-more"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-[var(--rz-eye)]"
            >
              About RyuZen
            </Link>
            <div className="mt-2 flex items-center gap-3 border-t border-[var(--rz-mist-soft)] pt-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 rounded border border-[var(--rz-mist)] py-2 text-center text-xs font-semibold text-[var(--rz-text-dim)]"
              >
                Log in
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 rounded py-2 text-center text-xs font-semibold"
                style={{ background: "var(--rz-eye)", color: "#04262e" }}
              >
                Begin Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
