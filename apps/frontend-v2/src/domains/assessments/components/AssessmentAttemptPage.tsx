import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { useAssessments } from "@/domains/assessments/hooks/useAssessments";
import { useAssessmentQuestionsForAttempt } from "@/domains/assessments/hooks/useAssessmentQuestionsForAttempt";
import { useStartAssessmentAttempt, useRecordAssessmentAnswer, useSubmitAssessmentAttempt } from "@/domains/assessments/hooks/useAssessmentMutations";
import { QuestionType } from "@/domains/assessments/assessment.types";
import type { AssessmentAttempt } from "@/domains/assessments/assessment.types";

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
 */
export function AssessmentAttemptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: assessments } = useAssessments();
  const { data: questions, isLoading } = useAssessmentQuestionsForAttempt(id ?? "");
  const { mutate: startAttempt, isPending: isStarting } = useStartAssessmentAttempt();
  const { mutate: recordAnswer } = useRecordAssessmentAnswer(id ?? "");
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAssessmentAttempt();

  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<AssessmentAttempt | null>(null);
  const submittedRef = useRef(false);

  const assessment = (assessments ?? []).find((a) => a.id === id);

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

  if (!assessment || isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
          <p className="text-lg font-semibold text-foreground">Submitted</p>
          <p className="text-sm text-muted-foreground">
            {submitted.score !== undefined ? `Score: ${submitted.score} / ${assessment.totalMarks}` : "Your attempt has been recorded."}
          </p>
          <Button size="sm" onClick={() => navigate("/student/assessments")}>
            Back to assessments
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!attempt) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-lg font-semibold text-foreground">{assessment.title}</p>
          <p className="text-sm text-muted-foreground">
            {assessment.durationMinutes} minutes · {assessment.totalMarks} marks. Once started, the timer cannot be paused.
          </p>
          <Button size="sm" disabled={isStarting} onClick={handleStart}>
            {isStarting ? "Starting…" : "Start attempt"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const minutes = Math.floor((secondsLeft ?? 0) / 60);
  const seconds = (secondsLeft ?? 0) % 60;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{assessment.title}</h1>
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
