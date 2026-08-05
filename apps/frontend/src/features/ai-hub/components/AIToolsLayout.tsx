import { NavLink, Outlet } from "react-router-dom";
import { Bot, FileSearch, Gauge, Compass, Mic, Sparkles } from "lucide-react";

import { cn } from "@/utils/cn";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

const AI_TABS = [
  { to: "/app/ai", label: "Overview", icon: Sparkles, end: true },
  { to: "/app/ai/chat", label: "AI Chat", icon: Bot },
  { to: "/app/ai/resume-review", label: "Resume Review", icon: FileSearch },
  { to: "/app/ai/career-score", label: "Career Score", icon: Gauge },
  { to: "/app/ai/recommendations", label: "Recommendations", icon: Compass },
  { to: "/app/ai/interview", label: "Mock Interview", icon: Mic },
];

/**
 * "Place all the AI features in one page and then navigate to the
 * required one" - one real hub at /app/ai plus a persistent tab strip
 * that stays visible on every AI sub-page, so switching tools never
 * means backing out to the hub first. The 5 real pages underneath
 * (AIChatPage, ResumeReviewPage, CareerScorePage, RecommendationsPage,
 * MockInterviewPage) are untouched - this wraps them via a nested
 * route + <Outlet />, not a rewrite.
 */
export function AIToolsLayout() {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="arcane-grid" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
        AI Tools
      </h1>

      <nav aria-label="AI Tools" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {AI_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
