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

import "@/app/pages/landing/landing.css";

interface LandingNavState {
  skipIntro?: boolean;
  scrollTo?: string;
}

/**
 * Real, preserved behavior from the original landing page: an
 * already-authenticated visitor is redirected straight to their real
 * portal, never shown the marketing page again.
 *
 * skipIntro/scrollTo: real navigation state set by ExitDemoButton's
 * router.navigate() call - confirmed via an actual recorded session
 * that a hard window.location.href reload could never reliably land
 * on #explore (a browser's native hash-scroll can't land correctly
 * inside a React SPA whose layout is still settling), and replayed
 * the entire opening cinematic besides. A real client-side navigation
 * carrying this state lets the hero skip straight to its fully
 * revealed end state and this component scroll precisely to the
 * requested section once mounted.
 */
export function LandingPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(false);

  const navState = location.state as LandingNavState | null;
  const skipIntro = Boolean(navState?.skipIntro);
  const scrollToRef = useRef(navState?.scrollTo);

  useEffect(() => {
    if (scrollToRef.current) {
      document.getElementById(scrollToRef.current)?.scrollIntoView({ behavior: "auto" });
    }
    // Deliberately empty deps: this should only ever run once, right
    // after mount, using whatever target this instance was mounted
    // with - scrollToRef.current is a ref (stable, correctly excluded
    // from deps), not the reactive navState value directly.
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
