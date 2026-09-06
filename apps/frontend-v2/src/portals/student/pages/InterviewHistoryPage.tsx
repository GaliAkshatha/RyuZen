import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMockInterviewHistory } from "@/domains/mock-interview/hooks/useMockInterviewHistory";
import { InterviewSessionStatus, type MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

const STATUS_STYLES: Record<string, { badge: string; icon: typeof Trophy }> = {
  COMPLETED: { badge: "bg-success/10 text-success", icon: Trophy },
  ABANDONED: { badge: "bg-warning/10 text-warning", icon: AlertCircle },
  IN_PROGRESS: { badge: "bg-primary/10 text-primary", icon: Clock },
};

/**
 * Real history, not a stub - backed by GET /api/v1/ai/interview
 * (already existed on the backend before this page did; this is the
 * first thing that actually calls it). Every past session, complete
 * or abandoned, with its real score and structured feedback
 * expandable inline.
 */
export function InterviewHistoryPage() {
  const { data: sessions, isLoading } = useMockInterviewHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const finishedSessions = (sessions ?? []).filter(
    (s) => s.status === InterviewSessionStatus.COMPLETED || s.status === InterviewSessionStatus.ABANDONED,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          to="/student/ai-assistant"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Interview History</h1>
          <p className="text-sm text-muted-foreground">Every mock interview you've taken, with the real feedback from each.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : finishedSessions.length === 0 ? (
        <EmptyState icon={Trophy} title="No completed interviews yet" description="Finish or end a mock interview to see it show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {finishedSessions.map((session) => (
            <InterviewHistoryCard
              key={session.id}
              session={session}
              expanded={expandedId === session.id}
              onToggle={() => setExpandedId((id) => (id === session.id ? null : session.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InterviewHistoryCard({
  session,
  expanded,
  onToggle,
}: {
  session: MockInterviewSession;
  expanded: boolean;
  onToggle: () => void;
}) {
  const style = STATUS_STYLES[session.status] ?? STATUS_STYLES.COMPLETED!;
  const StatusIcon = style.icon;

  return (
    <Card>
      <button type="button" onClick={onToggle} className="w-full text-left">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-5 w-5 ${session.status === InterviewSessionStatus.ABANDONED ? "text-warning" : "text-success"}`} aria-hidden="true" />
            <div>
              <CardTitle className="text-sm">{session.role}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {session.createdAt ? new Date(session.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) : ""} ·{" "}
                {session.exchanges.length} question{session.exchanges.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session.score !== undefined && <span className="text-sm font-semibold text-foreground">{session.score}/100</span>}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}>
              {session.status === InterviewSessionStatus.ABANDONED ? "Ended early" : "Completed"}
            </span>
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="flex flex-col gap-4 border-t border-border pt-4">
          {session.feedback && <p className="text-sm text-muted-foreground">{session.feedback}</p>}

          {(session.strengths?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                What went well
              </p>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {session.strengths!.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {(session.improvements?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-warning">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Where to improve
              </p>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {session.improvements!.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-border pt-3">
            {session.exchanges.map((ex, i) => (
              <div key={i} className="text-xs">
                <p className="font-medium text-foreground">
                  Q{i + 1}: {ex.question}
                </p>
                <p className="text-muted-foreground">{ex.answer ?? "(no answer given)"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
