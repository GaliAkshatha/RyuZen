import { useState } from "react";
import { Mic, Info, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { InterviewSessionStatus } from "@/types/enums";

import { useMyMockInterviews } from "@/features/mock-interview/hooks/useMyMockInterviews";
import { useMockInterview } from "@/features/mock-interview/hooks/useMockInterview";
import { useStartMockInterview } from "@/features/mock-interview/hooks/useStartMockInterview";
import { useAnswerMockInterview } from "@/features/mock-interview/hooks/useAnswerMockInterview";
import { StartInterviewForm } from "@/features/mock-interview/components/StartInterviewForm";
import { AnswerForm } from "@/features/mock-interview/components/AnswerForm";

const MAX_QUESTIONS = 5;

export function MockInterviewPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);

  const { data: sessions } = useMyMockInterviews();
  const { data: session, isLoading: isLoadingSession } = useMockInterview(activeSessionId);
  const {
    mutate: startInterview,
    isPending: isStarting,
    error: startError,
  } = useStartMockInterview();
  const {
    mutate: answerQuestion,
    isPending: isAnswering,
    error: answerError,
  } = useAnswerMockInterview(activeSessionId ?? "");

  const isComplete = session?.status === InterviewSessionStatus.COMPLETED;
  const currentExchange = session?.exchanges[session.exchanges.length - 1];
  const isAwaitingAnswer = currentExchange && !currentExchange.answer;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Mic className="h-6 w-6 text-primary" aria-hidden="true" />
          Mock Interview
        </h1>
        {sessions && sessions.length > 0 && (
          <Select
            value={activeSessionId ?? "__new__"}
            onValueChange={(value) => setActiveSessionId(value === "__new__" ? undefined : value)}
          >
            <SelectTrigger className="w-56" aria-label="Select session">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__new__">Start new interview</SelectItem>
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.role} (
                  {s.status === InterviewSessionStatus.COMPLETED
                    ? `Score: ${s.score}`
                    : "In progress"}
                  )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 font-body text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Questions are drawn from a small fixed pool, not genuinely role-specific. On completion,
          the score reflects how many answers were substantive (real), but the written feedback is
          placeholder text — no live language-model provider is configured yet.
        </span>
      </div>

      {!activeSessionId ? (
        <Card>
          <CardHeader>
            <CardTitle>Start a New Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <StartInterviewForm
              isSubmitting={isStarting}
              error={startError}
              onSubmit={(values) =>
                startInterview(values, { onSuccess: (created) => setActiveSessionId(created.id) })
              }
            />
          </CardContent>
        </Card>
      ) : isLoadingSession || !session ? (
        <Card>
          <CardContent className="p-6">
            <p className="font-body text-sm text-muted-foreground">Loading session…</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              {session.role} — Question {session.exchanges.length} of {MAX_QUESTIONS}
            </p>
            <StatusBadge status={session.status} />
          </div>

          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              {session.exchanges.map((exchange, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <p className="font-body text-sm font-medium text-foreground">
                    {exchange.question}
                  </p>
                  {exchange.answer && (
                    <p className="rounded-md bg-muted p-2 font-body text-sm text-muted-foreground">
                      {exchange.answer}
                    </p>
                  )}
                </div>
              ))}

              {isAwaitingAnswer && !isComplete && (
                <AnswerForm
                  isSubmitting={isAnswering}
                  error={answerError}
                  onSubmit={(values) => answerQuestion(values)}
                />
              )}
            </CardContent>
          </Card>

          {isComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  Interview Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="font-display text-4xl font-semibold text-foreground">
                  {session.score}/100
                </p>
                <p className="font-body text-sm text-muted-foreground">{session.feedback}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
