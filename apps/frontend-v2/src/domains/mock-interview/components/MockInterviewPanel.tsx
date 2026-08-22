import { useState } from "react";
import { Mic, Send, Trophy } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { EmptyState } from "@/shared/components/EmptyState";
import { useStartMockInterview } from "@/domains/mock-interview/hooks/useStartMockInterview";
import { useAnswerMockInterview } from "@/domains/mock-interview/hooks/useAnswerMockInterview";
import { InterviewSessionStatus } from "@/domains/mock-interview/mockInterview.types";

export function MockInterviewPanel() {
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const { mutate: startInterview, data: session, isPending: isStarting } = useStartMockInterview();
  const { mutate: sendAnswer, isPending: isAnswering } = useAnswerMockInterview(session?.id ?? "");
  const [currentSession, setCurrentSession] = useState(session);

  const activeSession = currentSession ?? session;
  const isComplete = activeSession?.status === InterviewSessionStatus.COMPLETED;

  if (!activeSession) {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState icon={Mic} title="Practice a real mock interview" description="Tell me what role you're preparing for." />
        <div className="flex items-center gap-2">
          <Input placeholder="e.g. Backend Developer" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button disabled={isStarting || !role.trim()} onClick={() => startInterview({ role }, { onSuccess: setCurrentSession })}>
            {isStarting ? "Starting…" : "Start"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Interviewing for: {activeSession.role}</p>
        <div className="flex flex-col gap-3">
          {activeSession.exchanges.map((ex, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-foreground">Q{i + 1}: {ex.question}</p>
              {ex.answer && <p className="text-sm text-muted-foreground">Your answer: {ex.answer}</p>}
            </div>
          ))}
        </div>
      </div>

      {isComplete ? (
        <div className="flex items-center gap-4 rounded-lg border border-success/30 bg-success/5 p-4">
          <Trophy className="h-6 w-6 text-success" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">Interview complete{activeSession.score ? ` — Score: ${activeSession.score}` : ""}</p>
            {activeSession.feedback && <p className="text-xs text-muted-foreground">{activeSession.feedback}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input placeholder="Type your answer…" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <Button
            size="icon"
            disabled={isAnswering || !answer.trim()}
            onClick={() =>
              sendAnswer({ answer }, { onSuccess: (updated) => { setCurrentSession(updated); setAnswer(""); } })
            }
            aria-label="Send answer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
