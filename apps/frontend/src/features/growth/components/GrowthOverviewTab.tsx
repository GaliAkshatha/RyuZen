import { Link } from "react-router-dom";
import { Code2, FolderKanban, Trophy, BadgeCheck, Briefcase, GraduationCap, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";

import type { UserPortfolioResponseDto } from "@/features/portfolio/types/portfolio.types";
import type { CareerScoreResponseDto } from "@/features/career-score/types/careerScore.types";

const SNAPSHOT_ITEMS = [
  { key: "skills" as const, label: "Skills", icon: Code2 },
  { key: "projects" as const, label: "Projects", icon: FolderKanban },
  { key: "achievements" as const, label: "Achievements", icon: Trophy },
  { key: "certifications" as const, label: "Certifications", icon: BadgeCheck },
  { key: "experience" as const, label: "Experience", icon: Briefcase },
  { key: "education" as const, label: "Education", icon: GraduationCap },
];

/**
 * "What have I accomplished? What am I missing?" - real counts from
 * the same portfolio aggregate every other tab reads from, and a
 * genuinely derived "missing" list (any category with zero real
 * entries), not a fabricated checklist. Each snapshot tile switches
 * the parent's active tab rather than navigating away, so exploring
 * a gap stays inside Growth.
 */
export function GrowthOverviewTab({
  portfolio,
  careerScore,
  onSelectTab,
}: {
  portfolio: UserPortfolioResponseDto;
  careerScore?: CareerScoreResponseDto;
  onSelectTab: (tab: string) => void;
}) {
  const missing = SNAPSHOT_ITEMS.filter((item) => (portfolio[item.key] as unknown[]).length === 0);

  return (
    <div className="flex flex-col gap-4">
      {careerScore && (
        <Card>
          <CardContent className="flex flex-col gap-1 py-4">
            <p className="font-body text-sm font-medium text-primary">{careerScore.label}</p>
            <p className="font-body text-sm text-foreground">{careerScore.narrative}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SNAPSHOT_ITEMS.map((item) => {
          const count = (portfolio[item.key] as unknown[]).length;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              className="group flex flex-col items-center gap-1 rounded-lg border border-border bg-card/60 p-4 text-center transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-display text-xl font-bold text-foreground">{count}</span>
              <span className="font-body text-xs text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {missing.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex flex-col gap-2 py-4">
            <p className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
              What's missing
            </p>
            <ul className="flex flex-wrap gap-2">
              {missing.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(item.key)}
                    className="font-body text-xs text-warning underline underline-offset-4 hover:text-foreground"
                  >
                    Add {item.label.toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {careerScore && careerScore.recommendations.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <p className="font-body text-sm font-medium text-foreground">Recommended next</p>
            <ul className="flex flex-col gap-1.5">
              {careerScore.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="font-body text-sm text-muted-foreground">
                  • {rec}
                </li>
              ))}
            </ul>
            <Link
              to="/app/ai/career-score"
              className="w-fit font-body text-xs text-primary underline underline-offset-4"
            >
              See full breakdown
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
