import { Link } from "react-router-dom";
import { TrendingUp, Trophy } from "lucide-react";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyPortfolio } from "@/features/portfolio/hooks/useMyPortfolio";

const SNAPSHOT_ITEMS = [
  { key: "skills" as const, label: "Skills", to: "/app/growth/skills" },
  { key: "projects" as const, label: "Projects", to: "/app/growth/projects" },
  { key: "experience" as const, label: "Experience", to: "/app/growth/experience" },
  { key: "certifications" as const, label: "Certifications", to: "/app/growth/certifications" },
  { key: "achievements" as const, label: "Achievements", to: "/app/growth/achievements" },
];

/**
 * Real counts only, from the same real portfolio aggregate used
 * throughout Growth. Deliberately excludes XP/points - Portfolio
 * (accomplishments) and Point Ledger/Leaderboard (points) are
 * different authoritative sources and are not blended here, per the
 * approved data map.
 */
export function GrowthSnapshotSection() {
  const { data: portfolio, isLoading, isError } = useMyPortfolio();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card/60 p-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonLoader key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (isError || !portfolio) {
    return (
      <div className="rounded-lg border border-border bg-card/60 p-4">
        <p className="font-body text-sm text-muted-foreground">Growth snapshot is unavailable right now.</p>
      </div>
    );
  }

  const recentAchievements = [...portfolio.achievements]
    .sort((a, b) => new Date(b.achievementDate).getTime() - new Date(a.achievementDate).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          Growth Snapshot
        </p>
        <Link to="/app/growth" className="font-body text-xs text-primary underline underline-offset-4">
          View Growth
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {SNAPSHOT_ITEMS.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className="group flex flex-col items-center gap-0.5 rounded-md border border-border bg-background/40 p-3 text-center transition-colors hover:border-primary/40"
          >
            <span className="font-display text-xl font-bold text-foreground group-hover:text-primary">
              {(portfolio[item.key] as unknown[]).length}
            </span>
            <span className="font-body text-xs text-muted-foreground">{item.label}</span>
          </Link>
        ))}
      </div>

      {recentAchievements.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-border pt-2">
          <p className="font-body text-xs text-muted-foreground">Recent achievements</p>
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-2">
              <Trophy className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate font-body text-sm text-foreground">{achievement.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
