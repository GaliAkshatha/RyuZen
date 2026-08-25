import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/domains/auth/AuthContext";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";

import { LandingNav } from "@/app/pages/landing/LandingNav";
import { HeroExperience } from "@/app/pages/landing/HeroExperience";
import { EcosystemScene } from "@/app/pages/landing/EcosystemScene";
import { IntelligenceScene } from "@/app/pages/landing/IntelligenceScene";
import { DemoScene } from "@/app/pages/landing/DemoScene";
import { FinalScene } from "@/app/pages/landing/FinalScene";
import { LandingFooter } from "@/app/pages/landing/LandingFooter";
import { SceneMist } from "@/app/pages/landing/SceneMist";
import { getLandingScrollPosition, saveLandingScrollPosition } from "@/app/pages/landing/landingScrollMemory";

import "@/app/pages/landing/landing.css";

interface LandingNavState {
  skipIntro?: boolean;
}

/**
 * Real, preserved behavior from the original landing page: an
 * already-authenticated visitor is redirected straight to their real
 * portal, never shown the marketing page again.
 *
 * Scroll restoration now uses sessionStorage (see
 * landingScrollMemory.ts) rather than router state alone - this is
 * what makes a genuine browser back/forward button (not just
 * ExitDemoButton's explicit navigation) correctly return to wherever
 * the visitor actually was, confirmed as the real gap in the
 * previous state-only approach.
 */
export function LandingPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(false);

  const navState = location.state as LandingNavState | null;
  const savedScrollRef = useRef(getLandingScrollPosition());
  const skipIntro = Boolean(navState?.skipIntro) || savedScrollRef.current !== null;

  useEffect(() => {
    if (savedScrollRef.current !== null) {
      window.scrollTo({ top: savedScrollRef.current, behavior: "auto" });
    }

    let frame: number | null = null;
    function onScroll() {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        saveLandingScrollPosition(window.scrollY);
        frame = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
    // Deliberately empty deps: this should only ever attach once per
    // mount, using whatever saved position existed at that moment.
  }, []);

  if (!isLoading && user) {
    return <Navigate to={getPortalPathForRole(user.role)} replace />;
  }

  return (
    <div className="ryuzen-landing">
      <LandingNav visible={navVisible} />
      <HeroExperience onNavReveal={() => setNavVisible(true)} skipIntro={skipIntro} />
      <SceneMist height={180} />
      <EcosystemScene />
      <SceneMist height={140} variant="convergence" />
      <IntelligenceScene />
      <SceneMist height={150} />
      <DemoScene />
      <SceneMist height={170} />
      <FinalScene />
      <LandingFooter />
    </div>
  );
}
