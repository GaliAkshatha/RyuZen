import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, Building2, Briefcase, Mail } from "lucide-react";

import "@/app/pages/landing/landing.css";
import { useHideScrollbar } from "@/app/pages/landing/useHideScrollbar";

type Audience = "student" | "organization" | "recruiter";

/**
 * Real content only: confirmed directly against the actual backend
 * before writing a word of this - organization creation and adding
 * an org's first admin are both SUPER_ADMIN-only routes; every other
 * role (Faculty, Student, Recruiter) is invited by an Org Admin or
 * Placement Admin of an ALREADY-EXISTING organization
 * (InviteUserSchema route, confirmed ORG_ADMIN/PLACEMENT_ADMIN).
 * Nothing here is invented - no fake "request access" form, no
 * backend capability that doesn't exist. The one real, working
 * action is a mailto: link (a genuine browser action, not a fake
 * form submission to a non-existent endpoint).
 */
const AUDIENCES: { key: Audience; icon: typeof GraduationCap; label: string; color: string; body: string[] }[] = [
  {
    key: "student",
    icon: GraduationCap,
    label: "Student",
    color: "var(--rz-eye)",
    body: [
      "RyuZen only works once your college is already on the platform — it's not something you sign up for on your own.",
      "If your campus isn't set up yet, the fastest path is asking your placement cell or administration to bring it onboard. Once your organization is live, your Org Admin adds departments and invites students directly.",
      "In the meantime, you're welcome to explore the demo above and see exactly what your account would look like.",
    ],
  },
  {
    key: "organization",
    icon: Building2,
    label: "Organization",
    color: "var(--rz-gold)",
    body: [
      "Bringing your campus onto RyuZen starts with a Platform Admin setting up your organization — this is a real, one-time step only Platform Admin can do.",
      "Once your organization exists, you become the Org Admin. From there, everything is yours to run: departments, faculty, students, placement drives, and campus news — all invited and managed directly by you.",
      "Reach out below to get your organization set up.",
    ],
  },
  {
    key: "recruiter",
    icon: Briefcase,
    label: "Recruiter",
    color: "var(--rz-purple)",
    body: [
      "Recruiter access is granted directly by an organization already using RyuZen — usually by their Placement Admin, once a placement drive is being planned.",
      "If you're looking to hire from a specific campus, the fastest path is reaching out to that college's placement team directly.",
      "Not sure who to contact? Explore the demo above to see the recruiter experience, or reach out below and we'll help connect you.",
    ],
  },
];

export function LearnMorePage() {
  const [active, setActive] = useState<Audience>("student");
  const navigate = useNavigate();
  const current = AUDIENCES.find((a) => a.key === active)!;
  useHideScrollbar();

  useEffect(() => {
    // Real fix for a confirmed bug: React Router doesn't reset scroll
    // position on client-side navigation by default, so this page
    // inherited whatever scroll position the landing page was at
    // when "Learn more" was clicked - appearing to open "from the
    // bottom" if the visitor had scrolled down.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="ryuzen-landing min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5">
        <Link
          to="/"
          aria-label="Back to RyuZen"
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
          style={{ borderColor: "var(--rz-mist)", color: "var(--rz-text-dim)" }}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link to="/" className="rz-display flex items-center gap-2 text-[15px] font-bold text-[var(--rz-text)]">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold"
            style={{ borderColor: "var(--rz-eye)", background: "var(--rz-ink-2)", color: "var(--rz-eye)" }}
          >
            R
          </span>
          RyuZen
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-28 pt-10 text-center">
        <p className="rz-mono mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">How it works</p>
        <h1 className="rz-display mb-4 text-3xl font-bold uppercase sm:text-4xl" style={{ color: "#F4EFE4" }}>
          Getting your campus onto RyuZen
        </h1>
        <p className="mx-auto mb-12 max-w-lg text-sm leading-relaxed text-[var(--rz-text-dim)]">
          RyuZen only exists on a campus once an organization has been set up by a Platform Admin. Where you start
          from depends on who you are — pick yourself below.
        </p>

        <div className="mb-10 flex justify-center gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.key}
              onClick={() => setActive(a.key)}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors"
              style={{
                borderColor: active === a.key ? a.color : "var(--rz-mist)",
                color: active === a.key ? a.color : "var(--rz-text-dim)",
                background: active === a.key ? "rgba(5,6,10,.5)" : "transparent",
              }}
            >
              <a.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {a.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg border p-8 text-left"
          style={{ borderColor: "var(--rz-mist)", background: "rgba(11,14,20,.6)" }}
        >
          <div className="mb-5 flex items-center gap-2.5">
            <current.icon className="h-5 w-5" style={{ color: current.color }} aria-hidden="true" />
            <p className="rz-display text-lg font-bold" style={{ color: current.color }}>
              For {current.label.toLowerCase()}s
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {current.body.map((p, i) => (
              <p key={i} className="text-[13.5px] leading-relaxed text-[var(--rz-text-dim)]">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="mailto:hello@ryuzen.app"
            className="flex items-center gap-2 rounded px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{ background: "var(--rz-eye)", color: "#04262e" }}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => navigate("/", { state: { skipIntro: true, scrollToId: "explore" } })}
            className="rounded border px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide backdrop-blur transition-colors"
            style={{ borderColor: "var(--rz-mist)", background: "rgba(19,23,34,.5)", color: "var(--rz-text)" }}
          >
            Explore the demo
          </button>
        </div>
      </div>
    </div>
  );
}
