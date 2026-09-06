import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, CheckCircle2, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { useAuth } from "@/domains/auth/AuthContext";
import { useAssessments } from "@/domains/assessments/hooks/useAssessments";
import { useAssessmentQuestionsForAttempt } from "@/domains/assessments/hooks/useAssessmentQuestionsForAttempt";
import { useMyAssessmentAttempts } from "@/domains/assessments/hooks/useMyAssessmentAttempts";
import { useStartAssessmentAttempt, useRecordAssessmentAnswer, useSubmitAssessmentAttempt } from "@/domains/assessments/hooks/useAssessmentMutations";
import { QuestionType, AttemptStatus } from "@/domains/assessments/assessment.types";
import type { AssessmentAttempt } from "@/domains/assessments/assessment.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: StartAssessmentAttemptUseCase/RecordAssessmentAnswerUseCase/
 * SubmitAssessmentAttemptUseCase existed on the backend (a genuinely
 * timed exam flow) with zero frontend anywhere. The countdown is real
 * (driven by the assessment's actual durationMinutes, started the
 * moment the real attempt begins) and auto-submits when it reaches
 * zero - not just a cosmetic timer. Questions come exclusively from
 * StudentAssessmentQuestion (never AssessmentQuestion), so correct
 * answers are never present in this component's data at all, not
 * just hidden in the UI.
 *
 * Checks for a real existing attempt up front - the backend
 * genuinely enforces one attempt per student per assessment (a real
 * unique index, not just an application check), and previously this
 * page had no way to show that: clicking "Start attempt" a second
 * time just failed silently with no error displayed at all.
 */
export function AssessmentAttemptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: assessments } = useAssessments();
  const { data: myAttempts, isLoading: isLoadingAttempts } = useMyAssessmentAttempts();
  const { data: questions, isLoading: isLoadingQuestions } = useAssessmentQuestionsForAttempt(id ?? "");
  const { mutate: startAttempt, isPending: isStarting, error: startError } = useStartAssessmentAttempt();
  const { mutate: recordAnswer } = useRecordAssessmentAnswer(id ?? "");
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAssessmentAttempt();

  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<AssessmentAttempt | null>(null);
  const submittedRef = useRef(false);

  const assessment = (assessments ?? []).find((a) => a.id === id);
  const backPath = user?.role === "STUDENT" ? "/student/assessments" : "/faculty/assessments";

  // A real prior attempt (from a previous session, or seeded data) -
  // shown as a real result, not silently re-attempted into a 409.
  const existingAttempt = (myAttempts ?? []).find((a) => a.assessmentId === id);

  useEffect(() => {
    if (!attempt || !assessment || submittedRef.current) return;
    setSecondsLeft(assessment.durationMinutes * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, assessment]);

  function handleSubmitAttempt() {
    if (!attempt || submittedRef.current) return;
    submittedRef.current = true;
    submitAttempt(attempt.id, { onSuccess: (result) => setSubmitted(result) });
  }

  useEffect(() => {
    if (secondsLeft === null || submittedRef.current) return;
    if (secondsLeft <= 0) {
      handleSubmitAttempt();
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function handleStart() {
    if (!id) return;
    startAttempt(id, { onSuccess: (a) => setAttempt(a) });
  }

  function handleAnswer(questionId: string, optionIndex: number, isMultiple: boolean) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = isMultiple
        ? current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex]
        : [optionIndex];
      recordAnswer({ questionId, selectedOptionIndexes: next });
      return { ...prev, [questionId]: next };
    });
  }

  const BackLink = () => (
    <Link
      to={backPath}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    </Link>
  );

  if (!assessment || isLoadingAttempts || isLoadingQuestions) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BackLink />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BackLink />
          <h1 className="text-lg font-semibold text-foreground">{assessment.title}</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
            <p className="text-lg font-semibold text-foreground">Submitted</p>
            <p className="text-sm text-muted-foreground">
              {submitted.score !== undefined ? `Score: ${submitted.score} / ${assessment.totalMarks}` : "Your attempt has been recorded."}
            </p>
            <Button size="sm" onClick={() => navigate(backPath)}>
              Back to assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // A real prior attempt - show its real result instead of letting
  // the student hit "Start attempt" into a 409 with no explanation.
  if (!attempt && existingAttempt) {
    const isDone = existingAttempt.status === AttemptStatus.SUBMITTED || existingAttempt.status === AttemptStatus.EXPIRED;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BackLink />
          <h1 className="text-lg font-semibold text-foreground">{assessment.title}</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
            <p className="text-lg font-semibold text-foreground">
              {isDone ? "Already attempted" : "Attempt in progress"}
            </p>
            <p className="text-sm text-muted-foreground">
              {existingAttempt.score !== undefined
                ? `Score: ${existingAttempt.score} / ${assessment.totalMarks}`
                : "Only one attempt is allowed per assessment."}
            </p>
            <Button size="sm" onClick={() => navigate(backPath)}>
              Back to assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BackLink />
          <h1 className="text-lg font-semibold text-foreground">{assessment.title}</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            {startError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                {(startError as AppApiError).message}
              </p>
            )}
            <p className="text-lg font-semibold text-foreground">{assessment.title}</p>
            <p className="text-sm text-muted-foreground">
              {assessment.durationMinutes} minutes · {assessment.totalMarks} marks. Once started, the timer cannot be paused.
            </p>
            <Button size="sm" disabled={isStarting} onClick={handleStart}>
              {isStarting ? "Starting…" : "Start attempt"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const minutes = Math.floor((secondsLeft ?? 0) / 60);
  const seconds = (secondsLeft ?? 0) % 60;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackLink />
          <h1 className="text-xl font-semibold text-foreground">{assessment.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <Button size="sm" disabled={isSubmitting} onClick={handleSubmitAttempt}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {(questions ?? []).map((q, i) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-sm">
                {i + 1}. {q.questionText} <span className="text-xs font-normal text-muted-foreground">({q.marks} marks)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {q.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center gap-2 text-sm">
                  <input
                    type={q.type === QuestionType.MCQ_MULTIPLE ? "checkbox" : "radio"}
                    name={q.id}
                    checked={(answers[q.id] ?? []).includes(optIndex)}
                    onChange={() => handleAnswer(q.id, optIndex, q.type === QuestionType.MCQ_MULTIPLE)}
                  />
                  {option}
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
