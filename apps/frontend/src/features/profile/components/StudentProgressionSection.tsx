import { Link } from "react-router-dom";
import { BookOpen, FileText, FolderKanban, Medal, Sparkles, Trophy } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { computeLevelProgress } from "@/utils/xpLevel";
import { AchievementStatus } from "@/types/enums";

import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";
import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";
import { useMyAchievements } from "@/features/achievements/hooks/useMyAchievements";
import { useStudentBadges } from "@/features/badges/hooks/useStudentBadges";
import { useMySkills } from "@/features/skills/hooks/useMySkills";
import { useMyCertificates } from "@/features/certificates/hooks/useMyCertificates";
import { useMyPortfolioProjects } from "@/features/portfolio/hooks/useMyPortfolioProjects";

function StatTile({ icon: Icon, label, value, to }: { icon: typeof BookOpen; label: string; value: number; to: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-4 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
    >
      <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
      <span className="font-display text-xl font-bold leading-none text-foreground">{value}</span>
      <span className="font-body text-[11px] text-muted-foreground">{label}</span>
    </Link>
  );
}

/**
 * The Student-specific progression panel on the shared ProfilePage.
 * Every number here is real: leaderboard points/rank (GET
 * /leaderboard/me), career score (AI3), verified achievements,
 * badges, skills, portfolio projects, certificates — no fabricated
 * placeholder stats. `studentId` for the badges lookup is resolved
 * from the leaderboard entry (every enrolled student has one; not
 * every student has submitted an achievement, so that path would be
 * less reliable) rather than adding a new backend endpoint.
 */
export function StudentProgressionSection() {
  const { data: entry, isLoading: loadingEntry } = useMyLeaderboardEntry();
  const { data: score } = useCareerScore();
  const { data: achievements } = useMyAchievements();
  const { data: skills } = useMySkills();
  const { data: certificates } = useMyCertificates();
  const { data: projects } = useMyPortfolioProjects();
  const { data: badges } = useStudentBadges(entry?.studentId ?? "");

  const verifiedAchievements = (achievements ?? []).filter((a) => a.status === AchievementStatus.VERIFIED);
  const progress = entry ? computeLevelProgress(entry.totalPoints) : null;

  if (loadingEntry) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progression hero: Level + Career Score side by side */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
        <CardContent className="flex flex-col items-center gap-6 py-6 sm:flex-row sm:justify-around">
          {progress && (
            <div className="flex items-center gap-4">
              <LevelProgressRing level={progress.level} progress={progress.progress} size={80} />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold leading-none text-foreground">
                  {entry!.totalPoints.toLocaleString()} XP
                </span>
                <span className="font-body text-sm text-muted-foreground">Rank #{entry!.rank}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {progress.pointsForNextLevel - progress.pointsIntoLevel} XP to Level {progress.level + 1}
                </span>
                <Link
                  to="/app/point-history"
                  className="mt-1 font-body text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  View point history
                </Link>
              </div>
            </div>
          )}
          {score && (
            <div className="flex items-center gap-4">
              <LevelProgressRing level={score.careerScore} progress={score.careerScore / 100} size={80} label="Score" />
              <div className="flex flex-col">
                <span className="font-body text-sm font-medium text-primary">{score.label}</span>
                <Link
                  to="/app/ai/career-score"
                  className="font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                >
                  Career Score breakdown
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick stats grid - each tile links to its real dedicated page,
        so "at a glance + jump to full page" lives here without also
        duplicating that page's own content inline (an embedded
        Achievements list previously did exactly that and was removed -
        confirmed as genuine redundancy, not useful summary). */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile icon={Trophy} label="Achievements" value={verifiedAchievements.length} to="/app/career/achievements" />
        <StatTile icon={Medal} label="Badges" value={(badges ?? []).length} to="/app/leaderboard" />
        <StatTile icon={Sparkles} label="Skills" value={(skills ?? []).length} to="/app/career/skills" />
        <StatTile icon={FolderKanban} label="Projects" value={(projects ?? []).length} to="/app/career/portfolio" />
        <StatTile icon={FileText} label="Certificates" value={(certificates ?? []).length} to="/app/certificates" />
      </div>
    </div>
  );
}
