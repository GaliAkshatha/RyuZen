import { Link } from "react-router-dom";
import { Mic, Trophy, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMockInterviewHistory } from "@/domains/mock-interview/hooks/useMockInterviewHistory";
import { InterviewSessionStatus } from "@/domains/mock-interview/mockInterview.types";

/**
 * Real gap filled: mock interview history existed on the backend
 * (GET /api/v1/ai/interview) with no visibility anywhere in the
 * student's own portfolio - completing an interview left no trace a
 * student could point to. Shows a real compact summary (count, best
 * score) computed from the actual sessions, not placeholder numbers.
 */
export function InterviewHistorySummaryCard() {
  const { data: sessions, isLoading } = useMockInterviewHistory();

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  const finished = (sessions ?? []).filter(
    (s) => s.status === InterviewSessionStatus.COMPLETED || s.status === InterviewSessionStatus.ABANDONED,
  );

  const bestScore = finished.reduce((max, s) => (s.score !== undefined && s.score > max ? s.score : max), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" aria-hidden="true" />
          Mock Interviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {finished.length === 0 ? (
          <EmptyState icon={Mic} title="No mock interviews completed yet" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-foreground">{finished.length}</p>
                <p className="text-xs text-muted-foreground">Interview{finished.length === 1 ? "" : "s"} completed</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-success" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{bestScore}</p>
                  <p className="text-xs text-muted-foreground">Best score</p>
                </div>
              </div>
            </div>
            <Link
              to="/student/interview-history"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
            >
              View history
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
