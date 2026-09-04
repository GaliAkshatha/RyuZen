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
import { useHideScrollbar } from "@/app/pages/landing/useHideScrollbar";

import "@/app/pages/landing/landing.css";

interface LandingNavState {
  skipIntro?: boolean;
  scrollToId?: string;
}

/**
 * Enhanced LandingPage:
 * - Direct seamless transition between Hero and Ecosystem without an empty gap
 * - Audio removed per user direction
 * - Section 3 (Intelligence) perfectly sized to fit the window view size
 * - Background artwork clearly visible across all scenes
 * - Demo section text full to the left side with visible city background
 */
export function LandingPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(false);
  useHideScrollbar();

  const navState = location.state as LandingNavState | null;
  const savedScrollRef = useRef(getLandingScrollPosition());
  const isExitingDemoRef = useRef(sessionStorage.getItem(EXITING_DEMO_KEY) === "true");
  const scrollToIdRef = useRef(navState?.scrollToId);
  const skipIntro = Boolean(navState?.skipIntro) || Boolean(scrollToIdRef.current) || savedScrollRef.current !== null;

  useEffect(() => {
    if (isExitingDemoRef.current) {
      sessionStorage.removeItem(EXITING_DEMO_KEY);
    }

    if (scrollToIdRef.current) {
      document.getElementById(scrollToIdRef.current)?.scrollIntoView({ behavior: "auto" });
    } else if (savedScrollRef.current !== null) {
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
  }, []);

  if (!isLoading && user && !isExitingDemoRef.current) {
    return <Navigate to={getPortalPathForRole(user.role)} replace />;
  }

  return (
    <div className="ryuzen-landing">
      <LandingNav visible={navVisible} />
      <HeroExperience onNavReveal={() => setNavVisible(true)} skipIntro={skipIntro} />
      {/* Moderate breathing room between first and second section */}
      <SceneMist height={36} />
      <EcosystemScene />
      <SceneMist height={36} variant="convergence" />
      <IntelligenceScene />
      <SceneMist height={32} variant="data-stream" />
      <DemoScene />
      <SceneMist height={32} variant="horizon" />
      <FinalScene />
      <LandingFooter />
    </div>
  );
}
