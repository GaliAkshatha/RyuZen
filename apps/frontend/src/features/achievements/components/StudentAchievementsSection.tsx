import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";

import { useStudentAchievements } from "@/features/achievements/hooks/useStudentAchievements";
import { VerifyAchievementAction } from "@/features/achievements/components/VerifyAchievementAction";
import { RejectAchievementAction } from "@/features/achievements/components/RejectAchievementAction";

/**
 * Embedded in StudentDetailPage (A2), which is SUPER_ADMIN/ORG_ADMIN
 * only. FACULTY genuinely has backend permission to verify/reject
 * achievements too (canReviewAchievements()), but — same documented
 * integration-scope limitation as C5's certificate issuance — this
 * milestone doesn't build a separate Faculty-reachable review queue
 * page, since StudentDetailPage is the only natural "review this
 * student's submissions" context that currently exists.
 */
export function StudentAchievementsSection({ studentId }: { studentId: string }) {
  const { data: achievements } = useStudentAchievements(studentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {!achievements || achievements.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No achievements submitted yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {achievements.map((achievement) => (
              <li key={achievement.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-foreground">{achievement.title}</span>
                  <StatusBadge status={achievement.status} />
                </div>
                <div className="flex gap-2">
                  <VerifyAchievementAction achievement={achievement} studentId={studentId} />
                  <RejectAchievementAction achievement={achievement} studentId={studentId} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
