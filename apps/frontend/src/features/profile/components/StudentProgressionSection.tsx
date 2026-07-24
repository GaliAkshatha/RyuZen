import { Link } from "react-router-dom";
import { Award, BookOpen, FileText, FolderKanban, Medal, Sparkles, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { computeLevelProgress } from "@/utils/xpLevel";
import { AchievementLevel, AchievementStatus } from "@/types/enums";

import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";
import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";
import { useMyAchievements } from "@/features/achievements/hooks/useMyAchievements";
import { useStudentBadges } from "@/features/badges/hooks/useStudentBadges";
import { useMySkills } from "@/features/skills/hooks/useMySkills";
import { useMyCertificates } from "@/features/certificates/hooks/useMyCertificates";
import { useMyPortfolioProjects } from "@/features/portfolio/hooks/useMyPortfolioProjects";

const ACHIEVEMENT_LEVEL_STYLE: Record<AchievementLevel, string> = {
  [AchievementLevel.COLLEGE]: "text-muted-foreground",
  [AchievementLevel.STATE]: "text-info",
  [AchievementLevel.NATIONAL]: "text-primary",
  [AchievementLevel.INTERNATIONAL]: "text-warning",
};

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

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile icon={Trophy} label="Achievements" value={verifiedAchievements.length} to="/app/career/achievements" />
        <StatTile icon={Medal} label="Badges" value={(badges ?? []).length} to="/app/leaderboard" />
        <StatTile icon={Sparkles} label="Skills" value={(skills ?? []).length} to="/app/career/skills" />
        <StatTile icon={FolderKanban} label="Projects" value={(projects ?? []).length} to="/app/career/portfolio" />
        <StatTile icon={FileText} label="Certificates" value={(certificates ?? []).length} to="/app/certificates" />
      </div>

      {/* Celebrated achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-primary" aria-hidden="true" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedAchievements.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">
              No verified achievements yet — submit one from your Achievements page to start building your
              record.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {verifiedAchievements.slice(0, 6).map((achievement) => (
                <li
                  key={achievement.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5"
                >
                  <Trophy
                    className={`h-5 w-5 shrink-0 ${achievement.level ? ACHIEVEMENT_LEVEL_STYLE[achievement.level] : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-medium text-foreground">{achievement.title}</p>
                    {achievement.level && (
                      <p className="font-body text-xs capitalize text-muted-foreground">
                        {achievement.level.toLowerCase()} level
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
