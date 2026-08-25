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
import { EXITING_DEMO_KEY } from "@/app/pages/landing/demoModeFlag";

import "@/app/pages/landing/landing.css";

interface LandingNavState {
  skipIntro?: boolean;
}

/**
 * Real, preserved behavior from the original landing page: an
 * already-authenticated visitor is redirected straight to their real
 * portal, never shown the marketing page again.
 *
 * isExitingDemoRef is the actual fix for "Exit Demo lands on
 * /login": confirmed this guard itself was the real second bug,
 * independent of logout()/navigate() ordering - during the brief
 * moment the router reaches "/" while the user is still (or again)
 * authenticated, this guard would fire and bounce straight back to
 * the portal, which ProtectedRoute then redirects to /login once
 * auth state finishes clearing. EXITING_DEMO_KEY (set by
 * ExitDemoButton right before it navigates) tells this one render to
 * skip the guard; the flag is cleared immediately after so a genuine
 * later authenticated visit to "/" still redirects normally.
 *
 * Scroll restoration uses sessionStorage (see
 * landingScrollMemory.ts) rather than router state alone - this is
 * what makes a genuine browser back/forward button (not just
 * ExitDemoButton's explicit navigation) correctly return to wherever
 * the visitor actually was.
 */
export function LandingPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(false);

  const navState = location.state as LandingNavState | null;
  const savedScrollRef = useRef(getLandingScrollPosition());
  const isExitingDemoRef = useRef(sessionStorage.getItem(EXITING_DEMO_KEY) === "true");
  const skipIntro = Boolean(navState?.skipIntro) || savedScrollRef.current !== null;

  useEffect(() => {
    if (isExitingDemoRef.current) {
      sessionStorage.removeItem(EXITING_DEMO_KEY);
    }

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

  if (!isLoading && user && !isExitingDemoRef.current) {
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
