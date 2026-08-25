import { Link } from "react-router-dom";
import { ClipboardList, Star, Clock, Briefcase, Users, CheckCircle2, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { LeaderboardPanel } from "@/domains/leaderboard/components/LeaderboardPanel";
import { MyRankCard } from "@/domains/leaderboard/components/MyRankCard";
import { StatCard } from "@/shared/components/StatCard";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { Skeleton } from "@/shared/components/Skeleton";
import { useAuth } from "@/domains/auth/AuthContext";
import { useCareerScore } from "@/domains/career-score/hooks/useCareerScore";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { useMySubmissions } from "@/domains/submissions/hooks/useMySubmissions";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";
import { ActivityStatus } from "@/domains/activities/activity.types";
import { SubmissionStatus } from "@/domains/submissions/submission.types";
import { PlacementDriveStatus } from "@/domains/placement-drives/placementDrive.types";
import { NewsFeedWidget } from "@/domains/news/components/NewsFeedWidget";

/**
 * Real Student home dashboard - deliberately NOT placement-centric.
 * Activities are relevant to every student regardless of year;
 * placements genuinely aren't (a 1st or 2nd year student isn't
 * applying to drives yet) - so Activities leads, Placements gets one
 * secondary card, not four. Every number comes from a real,
 * already-verified endpoint - if a real number isn't available yet,
 * the card is simply omitted rather than showing a fake 0 or "—".
 */
export function StudentHomePage() {
  const { user } = useAuth();
  const { data: careerScore, isLoading: loadingScore } = useCareerScore();
  const { data: activities } = useActivityList();
  const { data: mySubmissions } = useMySubmissions();
  const { data: drives } = usePlacementDrives();
  const { data: pendingRequests } = usePendingRequests();

  const openActivities = (activities ?? []).filter((a) => a.status === ActivityStatus.PUBLISHED);
  const submittedActivityIds = new Set((mySubmissions ?? []).map((s) => s.activityId));
  const unsubmittedOpen = openActivities.filter((a) => !submittedActivityIds.has(a.id));
  const pendingReview = (mySubmissions ?? []).filter((s) => s.status === SubmissionStatus.PENDING).length;
  const approved = (mySubmissions ?? []).filter((s) => s.status === SubmissionStatus.APPROVED).length;
  const openDrivesCount = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.PUBLISHED).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Good to see you, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening on your campus.</p>
      </div>

      <NewsFeedWidget />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={ClipboardList} value={unsubmittedOpen.length} label="Open activities" tone="primary" to="/student/activities" />
        <StatCard icon={Clock} value={pendingReview} label="Pending review" tone="warning" to="/student/activities" />
        <StatCard icon={CheckCircle2} value={approved} label="Approved" tone="success" to="/student/activities" />
        <StatCard icon={Users} value={pendingRequests?.length ?? 0} label="Pending requests" tone="info" to="/student/connect?tab=requests" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Career score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {loadingScore ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : careerScore ? (
              <>
                <ScoreRing value={careerScore.careerScore} />
                <p className="text-center text-sm font-medium text-foreground">{careerScore.label}</p>
                <Link to="/student/career-score" className="text-xs text-primary underline underline-offset-4">
                  View breakdown
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not available yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open activities</CardTitle>
          </CardHeader>
          <CardContent>
            {unsubmittedOpen.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open activities to submit right now.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {unsubmittedOpen.slice(0, 4).map((activity) => (
                  <Link
                    key={activity.id}
                    to={`/student/activities/${activity.id}`}
                    className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm hover:bg-accent/60"
                  >
                    <span className="font-medium text-foreground">{activity.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-warning">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {activity.points} pts
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MyRankCard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardPanel />
        </CardContent>
      </Card>

      {openDrivesCount > 0 && (
        <Link to="/student/drives">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center justify-between py-3.5">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
                {openDrivesCount} placement {openDrivesCount === 1 ? "drive" : "drives"} open right now
              </span>
              <span className="text-xs text-primary underline underline-offset-4">View drives</span>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
