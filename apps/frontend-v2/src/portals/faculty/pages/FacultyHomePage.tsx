import { FileText, Send, Lock, Pencil, Trophy } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { LeaderboardPanel } from "@/domains/leaderboard/components/LeaderboardPanel";
import { useAuth } from "@/domains/auth/AuthContext";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { ActivityStatus } from "@/domains/activities/activity.types";

/** Real Faculty home - same client-side ownership filter ActivityListPage already uses (server-side ownership is enforced on every real mutation regardless). */
export function FacultyHomePage() {
  const { user } = useAuth();
  const { data: activities } = useActivityList();

  const myActivities = (activities ?? []).filter((a) => a.createdBy === user?.id);
  const published = myActivities.filter((a) => a.status === ActivityStatus.PUBLISHED).length;
  const draft = myActivities.filter((a) => a.status === ActivityStatus.DRAFT).length;
  const closed = myActivities.filter((a) => a.status === ActivityStatus.CLOSED).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">A snapshot of your activities.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={FileText} value={myActivities.length} label="Total activities" tone="primary" to="/faculty/activities" />
        <StatCard icon={Send} value={published} label="Published" tone="success" to="/faculty/activities" />
        <StatCard icon={Pencil} value={draft} label="Drafts" tone="warning" to="/faculty/activities" />
        <StatCard icon={Lock} value={closed} label="Closed" tone="info" to="/faculty/activities" />
      </div>

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
    </div>
  );
}
