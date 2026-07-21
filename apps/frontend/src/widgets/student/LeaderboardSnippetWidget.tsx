import { Link } from "react-router-dom";
import { Award } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel, resolveStudentById } from "@/features/students/utils/studentLabels";

/** Wired in C4 — top 5 ranked students, from the same GET /leaderboard every role can browse. */
export function LeaderboardSnippetWidget() {
  const { data: entries, isLoading } = useLeaderboard();
  const { data: students } = useStudents();

  const top = [...(entries ?? [])].sort((a, b) => a.rank - b.rank).slice(0, 5);

  return (
    <WidgetCard title="Leaderboard" icon={Award} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : top.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No leaderboard entries yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {top.map((entry) => {
            const student = resolveStudentById(students, entry.studentId);
            return (
              <li key={entry.id}>
                <Link
                  to={`/app/leaderboard/${entry.studentId}`}
                  className="flex items-center justify-between gap-2 font-body text-sm text-foreground hover:underline"
                >
                  <span className="truncate">
                    #{entry.rank} {student ? studentLabel(student) : entry.studentId}
                  </span>
                  <span className="shrink-0 text-muted-foreground">{entry.totalPoints} pts</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetCard>
  );
}
