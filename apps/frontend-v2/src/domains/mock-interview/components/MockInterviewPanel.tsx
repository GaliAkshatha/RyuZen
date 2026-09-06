import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Mic, MicOff, Send, Trophy, Volume2, VolumeX, Clock, XCircle, History, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { useStartMockInterview } from "@/domains/mock-interview/hooks/useStartMockInterview";
import { useAnswerMockInterview } from "@/domains/mock-interview/hooks/useAnswerMockInterview";
import { useAbandonMockInterview } from "@/domains/mock-interview/hooks/useAbandonMockInterview";
import { useVoiceInterview } from "@/domains/mock-interview/hooks/useVoiceInterview";
import {
  InterviewSessionStatus,
  INTERVIEW_ROLE_OPTIONS,
  type MockInterviewSession,
} from "@/domains/mock-interview/mockInterview.types";

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "bg-success/10 text-success",
  MEDIUM: "bg-warning/10 text-warning",
  HARD: "bg-destructive/10 text-destructive",
};

function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MockInterviewPanel() {
  const [role, setRole] = useState<string>(INTERVIEW_ROLE_OPTIONS[0]);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [answer, setAnswer] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  const { mutate: startInterview, isPending: isStarting } = useStartMockInterview();
  const [currentSession, setCurrentSession] = useState<MockInterviewSession | null>(null);
  const { mutate: sendAnswer, isPending: isAnswering } = useAnswerMockInterview(currentSession?.id ?? "");
  const { mutate: abandonInterview, isPending: isAbandoning } = useAbandonMockInterview(currentSession?.id ?? "");
  const voice = useVoiceInterview();

  const spokenQuestionRef = useRef<string | null>(null);
  const autoSubmittedRef = useRef<string | null>(null);

  const isFinished =
    currentSession?.status === InterviewSessionStatus.COMPLETED ||
    currentSession?.status === InterviewSessionStatus.ABANDONED;
  const lastExchange = currentSession?.exchanges[currentSession.exchanges.length - 1];

  // Real 1-second tick driving both countdowns - not a one-shot calculation, so the displayed time genuinely counts down live.
  useEffect(() => {
    if (!currentSession || isFinished) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [currentSession, isFinished]);

  const overallRemainingSeconds = currentSession
    ? currentSession.durationMinutes * 60 - (now - new Date(currentSession.createdAt ?? now).getTime()) / 1000
    : 0;

  const questionRemainingSeconds =
    currentSession && lastExchange && !lastExchange.answer
      ? currentSession.perQuestionSeconds - (now - new Date(lastExchange.askedAt).getTime()) / 1000
      : null;

  const submitAnswer = useCallback(
    (text: string) => {
      if (!currentSession) return;
      voice.stopListening();
      sendAnswer(
        { answer: text || "(no answer given - time ran out)" },
        {
          onSuccess: (updated) => {
            setCurrentSession(updated);
            setAnswer("");
            spokenQuestionRef.current = null;
            autoSubmittedRef.current = null;
          },
        },
      );
    },
    [currentSession, sendAnswer, voice],
  );

  // Real per-question auto-submit when the clock actually runs out - matching real interview pressure, not just a cosmetic countdown. Guarded so it only fires once per question even as `now` keeps ticking past zero.
  useEffect(() => {
    if (
      questionRemainingSeconds !== null &&
      questionRemainingSeconds <= 0 &&
      lastExchange &&
      autoSubmittedRef.current !== lastExchange.question &&
      !isAnswering
    ) {
      autoSubmittedRef.current = lastExchange.question;
      submitAnswer(answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionRemainingSeconds, lastExchange, isAnswering]);

  // Real voice output - speaks each new question once, when autoSpeak is on and voice synthesis is actually supported.
  useEffect(() => {
    if (!autoSpeak || !voice.speechSynthesisSupported || !lastExchange || lastExchange.answer) return;
    if (spokenQuestionRef.current === lastExchange.question) return;
    spokenQuestionRef.current = lastExchange.question;
    voice.speak(lastExchange.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastExchange, autoSpeak, voice.speechSynthesisSupported]);

  function toggleListening() {
    if (voice.isListening) {
      voice.stopListening();
      return;
    }
    voice.startListening((transcript) => setAnswer(transcript));
  }

  function handleQuit() {
    if (!confirmingQuit) {
      setConfirmingQuit(true);
      return;
    }
    abandonInterview(undefined, {
      onSuccess: (updated) => {
        setCurrentSession(updated);
        setConfirmingQuit(false);
      },
    });
  }

  function startNewInterview() {
    setCurrentSession(null);
    setAnswer("");
    setConfirmingQuit(false);
  }

  if (!currentSession) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <EmptyState icon={Mic} title="Practice a real mock interview" description="Pick the role you're preparing for." />
          <Link to="/student/interview-history" className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            View history
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9 flex-1 rounded-md border border-input bg-transparent px-2 text-sm"
            >
              {INTERVIEW_ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button
              disabled={isStarting}
              onClick={() => startInterview({ role, durationMinutes }, { onSuccess: setCurrentSession })}
            >
              {isStarting ? "Starting…" : "Start"}
            </Button>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Interview length:
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              <option value={10}>10 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </label>
          {!voice.speechRecognitionSupported && (
            <p className="text-xs text-muted-foreground">Voice input isn't supported in this browser - Chrome, Edge, or Safari support it.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-border p-3 text-xs">
        <span className="font-medium text-muted-foreground">Interviewing for: {currentSession.role}</span>
        {!isFinished && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatSeconds(overallRemainingSeconds)} total
            </span>
            {questionRemainingSeconds !== null && (
              <span className={`flex items-center gap-1 font-mono ${questionRemainingSeconds < 15 ? "text-destructive" : "text-foreground"}`}>
                {formatSeconds(questionRemainingSeconds)} for this question
              </span>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="flex flex-col gap-3">
          {currentSession.exchanges.map((ex, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                Q{i + 1}: {ex.question}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_STYLES[ex.difficulty] ?? ""}`}>
                  {ex.difficulty}
                </span>
              </p>
              {ex.answer && (
                <p className="text-sm text-muted-foreground">
                  Your answer: {ex.answer}
                  {ex.qualityScore !== undefined && (
                    <span className="ml-2 text-xs font-medium text-primary">(quality: {ex.qualityScore}/100)</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {isFinished ? (
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center gap-4 rounded-lg border p-4 ${
              currentSession.status === InterviewSessionStatus.ABANDONED
                ? "border-warning/30 bg-warning/5"
                : "border-success/30 bg-success/5"
            }`}
          >
            {currentSession.status === InterviewSessionStatus.ABANDONED ? (
              <AlertCircle className="h-6 w-6 shrink-0 text-warning" aria-hidden="true" />
            ) : (
              <Trophy className="h-6 w-6 shrink-0 text-success" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {currentSession.status === InterviewSessionStatus.ABANDONED ? "Interview ended early" : "Interview complete"}
                {currentSession.score !== undefined ? ` — Score: ${currentSession.score}/100` : ""}
              </p>
              {currentSession.feedback && <p className="text-xs text-muted-foreground">{currentSession.feedback}</p>}
            </div>
          </div>

          {(currentSession.strengths?.length ?? 0) > 0 && (
            <div className="rounded-lg border border-success/20 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                What went well
              </p>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {currentSession.strengths!.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {(currentSession.improvements?.length ?? 0) > 0 && (
            <div className="rounded-lg border border-warning/20 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-warning">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Where to improve
              </p>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {currentSession.improvements!.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={startNewInterview}>
              Start another interview
            </Button>
            <Link to="/student/interview-history" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              View all past interviews
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {voice.speechRecognitionSupported && (
              <Button
                type="button"
                size="icon"
                variant={voice.isListening ? "destructive" : "outline"}
                onClick={toggleListening}
                aria-label={voice.isListening ? "Stop voice input" : "Start voice input"}
              >
                {voice.isListening ? <MicOff className="h-4 w-4" aria-hidden="true" /> : <Mic className="h-4 w-4" aria-hidden="true" />}
              </Button>
            )}
            <input
              placeholder={voice.isListening ? "Listening…" : "Type or speak your answer…"}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
            />
            <Button
              size="icon"
              disabled={isAnswering || !answer.trim()}
              onClick={() => submitAnswer(answer)}
              aria-label="Send answer"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            {voice.speechSynthesisSupported && (
              <button
                type="button"
                onClick={() => setAutoSpeak((v) => !v)}
                className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {autoSpeak ? <Volume2 className="h-3.5 w-3.5" aria-hidden="true" /> : <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />}
                {autoSpeak ? "Reading questions aloud" : "Voice output off"}
              </button>
            )}
            <button
              type="button"
              onClick={handleQuit}
              disabled={isAbandoning}
              className={`flex items-center gap-1 text-xs font-medium ${confirmingQuit ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
            >
              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {isAbandoning ? "Ending…" : confirmingQuit ? "Click again to confirm quitting" : "Quit interview"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
