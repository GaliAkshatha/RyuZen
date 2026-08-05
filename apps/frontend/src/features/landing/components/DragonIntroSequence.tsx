import { useEffect, useRef, useState } from "react";

type Stage = "void" | "stars" | "eyes" | "emerge" | "clouds" | "circle" | "reveal" | "done";

const STAGE_ORDER: Stage[] = ["void", "stars", "eyes", "emerge", "clouds", "circle", "reveal", "done"];

/** Milliseconds spent in each stage before advancing to the next. */
const STAGE_DURATIONS: Record<Stage, number> = {
  void: 900,
  stars: 1800,
  eyes: 1600,
  emerge: 2400,
  clouds: 2000,
  circle: 2200,
  reveal: 1600,
  done: 0,
};

const SESSION_KEY = "ryuzen-intro-seen";

// Exact Dark Fantasy Academy tokens (styles/tokens.css .dark block) —
// hardcoded here deliberately rather than read from CSS variables,
// since the canvas 2D API needs real color strings at draw time, not
// var() references. Kept in the same three-color language as the rest
// of the brand: indigo void, illuminated gold, verdigris/violet accents.
const COLOR_VOID = "hsl(258, 32%, 8%)";
const COLOR_GOLD = "hsl(42, 55%, 55%)";
const COLOR_VERDIGRIS = "hsl(155, 32%, 40%)";
const COLOR_VIOLET = "hsl(270, 40%, 30%)";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
}

/**
 * A one-time, per-session brand intro — dark void, drifting starlight,
 * two eyes resolving out of the dark, a dragon silhouette emerging
 * toward the viewer through smoke, clouds parting, the dragon circling
 * down to coil around a glowing gem, then the real world (and the real
 * LandingPage) resolves underneath it.
 *
 * Deliberately stylized, not photorealistic — a glowing line-art
 * silhouette and particle light, in the same restrained language
 * PageAtmosphere already uses for the rest of the product, not an
 * attempt at a rendered 3D creature (no such asset exists to build
 * from). Gated to play once per browser session (sessionStorage), with
 * an always-visible skip control and full prefers-reduced-motion
 * support — reduced-motion users go straight to the real page.
 */
export function DragonIntroSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("void");
  const [skipping, setSkipping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const stageRef = useRef<Stage>("void");
  stageRef.current = stage;

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    onComplete();
  };

  // Reduced motion: skip the whole sequence immediately, real content
  // underneath just appears — never force motion-sensitive users
  // through a 13-second animation to reach the product.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    if (sessionStorage.getItem(SESSION_KEY)) {
      finish();
      return;
    }

    let cancelled = false;
    let index = 0;

    function advance() {
      if (cancelled) return;
      const current = STAGE_ORDER[index];

      if (!current) {
        finish();
        return;
      }

      setStage(current);

      if (current === "done") {
        finish();
        return;
      }

      window.setTimeout(() => {
        index += 1;
        advance();
      }, STAGE_DURATIONS[current]);
    }

    advance();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Particle field: real canvas 2D animation, not a static image —
  // density and drift speed both increase as the sequence progresses,
  // reading as "energy gathering" toward the emerge/circle stages.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = 140;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.4,
      baseOpacity: Math.random() * 0.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.006,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.15,
    }));

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentStage = stageRef.current;
      const intensity =
        currentStage === "void"
          ? 0
          : currentStage === "stars"
            ? 0.5
            : currentStage === "eyes"
              ? 0.7
              : currentStage === "emerge"
                ? 1
                : currentStage === "clouds"
                  ? 0.8
                  : currentStage === "circle"
                    ? 1
                    : currentStage === "reveal"
                      ? 0.3
                      : 0;

      for (const p of particlesRef.current) {
        p.x += p.driftX * (currentStage === "emerge" || currentStage === "circle" ? 3 : 1);
        p.y += p.driftY * (currentStage === "emerge" || currentStage === "circle" ? 3 : 1);

        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const twinkle = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        const opacity = p.baseOpacity * twinkle * intensity;

        if (opacity <= 0.01) continue;

        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = COLOR_GOLD.replace("hsl(", "hsla(").replace(")", `, ${opacity})`);
        ctx.fill();
      }

      t += 1;
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const showEyes = stage === "eyes" || stage === "emerge" || stage === "clouds" || stage === "circle";
  const showDragon = stage === "emerge" || stage === "clouds" || stage === "circle" || stage === "reveal";
  const dragonCircling = stage === "circle" || stage === "reveal";
  const showClouds = stage === "clouds" || stage === "circle";
  const showGem = stage === "circle" || stage === "reveal";
  const worldReveal = stage === "reveal";

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[hsl(258,32%,8%)] transition-opacity duration-[1400ms] ease-out ${
        skipping ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionProperty: "opacity" }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Particle field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* World horizon — faint mountain silhouette, only in the final reveal beat */}
      <svg
        className={`absolute inset-x-0 bottom-0 h-1/2 w-full transition-opacity duration-[1800ms] ease-out ${
          worldReveal ? "opacity-100" : "opacity-0"
        }`}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,400 L0,260 L180,180 L340,240 L520,120 L700,220 L900,140 L1080,230 L1260,160 L1440,260 L1440,400 Z"
          fill={COLOR_VOID}
          stroke={COLOR_VIOLET}
          strokeWidth="1"
          opacity="0.8"
        />
      </svg>

      {/* Clouds parting */}
      <div
        className={`absolute inset-0 transition-all duration-[2200ms] ease-in-out ${
          showClouds ? "opacity-90" : "opacity-0"
        }`}
      >
        <div
          className={`absolute top-1/2 h-[140%] w-[70%] -translate-y-1/2 rounded-full blur-3xl transition-transform duration-[2200ms] ease-in-out ${
            stage === "circle" || stage === "reveal" ? "-translate-x-[110%]" : "-translate-x-1/4"
          }`}
          style={{ background: `radial-gradient(circle, ${COLOR_VIOLET} 0%, transparent 70%)` }}
        />
        <div
          className={`absolute right-0 top-1/2 h-[140%] w-[70%] -translate-y-1/2 rounded-full blur-3xl transition-transform duration-[2200ms] ease-in-out ${
            stage === "circle" || stage === "reveal" ? "translate-x-[110%]" : "translate-x-1/4"
          }`}
          style={{ background: `radial-gradient(circle, ${COLOR_VIOLET} 0%, transparent 70%)` }}
        />
      </div>

      {/* Eyes, dragon silhouette, gem — the central tableau */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative transition-all ease-out ${
            dragonCircling
              ? "duration-[2200ms]"
              : stage === "emerge"
                ? "duration-[2400ms]"
                : "duration-700"
          }`}
          style={{
            transform: showDragon
              ? dragonCircling
                ? "scale(0.55) translateY(8%)"
                : "scale(1)"
              : "scale(0.15)",
            opacity: showDragon || showEyes ? 1 : 0,
          }}
        >
          {/* Glow behind the whole tableau */}
          <div
            className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${COLOR_GOLD}33 0%, transparent 70%)`,
              opacity: showDragon ? 0.9 : 0.4,
            }}
          />

          <svg
            width="420"
            height="420"
            viewBox="0 0 420 420"
            className={dragonCircling ? "animate-[dragon-circle_2.2s_ease-in-out_1]" : ""}
          >
            <defs>
              <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLOR_GOLD} stopOpacity="1" />
                <stop offset="100%" stopColor={COLOR_GOLD} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="scaleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={COLOR_VERDIGRIS} stopOpacity="0.5" />
                <stop offset="100%" stopColor={COLOR_VOID} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Dragon head silhouette — stylized line-art, not a rendered creature */}
            <g
              className={`transition-opacity duration-[1200ms] ${showDragon ? "opacity-100" : "opacity-0"}`}
              stroke={COLOR_GOLD}
              strokeWidth="1.5"
              fill="url(#scaleGradient)"
            >
              {/* horns */}
              <path d="M150,120 L120,40 L145,95 Z" />
              <path d="M270,120 L300,40 L275,95 Z" />
              {/* brow ridges + snout */}
              <path
                d="M110,150
                   C 110,110 160,80 210,80
                   C 260,80 310,110 310,150
                   C 310,190 280,205 260,215
                   C 250,255 235,290 210,310
                   C 185,290 170,255 160,215
                   C 140,205 110,190 110,150 Z"
              />
              {/* jaw line detail */}
              <path d="M160,215 C 175,235 195,245 210,248 C 225,245 245,235 260,215" fill="none" opacity="0.7" />
            </g>

            {/* Eyes */}
            <g className={`transition-opacity duration-1000 ${showEyes ? "opacity-100" : "opacity-0"}`}>
              <ellipse
                cx="168"
                cy="150"
                rx="14"
                ry="7"
                fill="url(#eyeGlow)"
                className="animate-[eye-pulse_2.4s_ease-in-out_infinite]"
              />
              <ellipse
                cx="252"
                cy="150"
                rx="14"
                ry="7"
                fill="url(#eyeGlow)"
                className="animate-[eye-pulse_2.4s_ease-in-out_infinite]"
              />
            </g>
          </svg>

          {/* Gem */}
          <div
            className={`absolute left-1/2 top-[85%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[1400ms] ${
              showGem ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              background: `radial-gradient(circle at 35% 30%, #fff8, ${COLOR_GOLD} 40%, ${COLOR_VERDIGRIS} 100%)`,
              boxShadow: `0 0 40px 10px ${COLOR_GOLD}66`,
            }}
          />
        </div>
      </div>

      {/* Skip control — always reachable, never forces the sequence on anyone */}
      <button
        type="button"
        onClick={() => {
          setSkipping(true);
          window.setTimeout(finish, 400);
        }}
        className="absolute bottom-6 right-6 rounded-md border border-[hsl(42,55%,55%)]/30 px-4 py-2 font-body text-xs text-[hsl(42,38%,90%)]/70 transition-colors hover:border-[hsl(42,55%,55%)]/60 hover:text-[hsl(42,38%,90%)]"
      >
        Skip
      </button>

      <style>{`
        @keyframes eye-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes dragon-circle {
          0% { transform: translateX(0) rotate(0deg); }
          30% { transform: translateX(-60px) translateY(-20px) rotate(-8deg); }
          60% { transform: translateX(60px) translateY(-10px) rotate(6deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
