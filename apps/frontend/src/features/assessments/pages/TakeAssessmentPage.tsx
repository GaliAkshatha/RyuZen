import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Spinner } from "@/shared/components/Spinner";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";

import { useStartAssessmentAttempt } from "@/features/assessments/hooks/useStartAssessmentAttempt";
import { useAssessmentQuestionsForAttempt } from "@/features/assessments/hooks/useAssessmentQuestionsForAttempt";
import { useRecordAssessmentAnswer } from "@/features/assessments/hooks/useRecordAssessmentAnswer";
import { useSubmitAssessmentAttempt } from "@/features/assessments/hooks/useSubmitAssessmentAttempt";

/**
 * The real student payoff. An attempt is started once on mount (the
 * real server-side eligibility/window/duplicate checks all happen
 * there - this page never assumes it's allowed, it finds out from the
 * real response). Every answer is recorded to the server as the
 * student picks it, not just held in local state until submit - so a
 * closed tab doesn't lose real progress. The countdown is a real
 * client-side convenience only; the actual time enforcement happens
 * server-side on submit (SubmitAssessmentAttemptUseCase), confirmed
 * against the backend directly - this timer can never be trusted to
 * extend a real student's actual allowed time.
 */
export function TakeAssessmentPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: startAttempt, data: attempt, isPending: starting, error: startError } =
    useStartAssessmentAttempt();
  const { data: questions, isLoading: questionsLoading } =
    useAssessmentQuestionsForAttempt(assessmentId!);
  const { mutate: recordAnswer } = useRecordAssessmentAnswer(attempt?.id ?? "");
  const { mutate: submitAttempt, isPending: submitting, isSuccess, data: result } =
    useSubmitAssessmentAttempt();

  const [selections, setSelections] = useState<Record<string, number[]>>({});

  useEffect(() => {
    if (assessmentId) {
      startAttempt(assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  const sortedQuestions = useMemo(
    () => [...(questions ?? [])].sort((a, b) => a.order - b.order),
    [questions],
  );

  function toggleOption(questionId: string, optionIndex: number, single: boolean) {
    setSelections((prev) => {
      const current = prev[questionId] ?? [];
      const next = single
        ? [optionIndex]
        : current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex];

      recordAnswer({ questionId, selectedOptionIndexes: next });

      return { ...prev, [questionId]: next };
    });
  }

  function handleSubmit() {
    if (!attempt) return;
    submitAttempt(attempt.id, {
      onSuccess: () => toast({ title: "Assessment submitted" }),
    });
  }

  if (starting || questionsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (startError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="font-body text-sm text-destructive">
          {(startError as { message?: string }).message ?? "Couldn't start this assessment."}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  if (isSuccess && result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="max-w-sm">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
            <p className="font-display text-lg font-semibold text-foreground">
              Assessment submitted
            </p>
            {result.score !== undefined && (
              <p className="font-body text-sm text-muted-foreground">
                Your real score: <strong>{result.score}</strong>
              </p>
            )}
            <Button size="sm" className="mt-2" onClick={() => navigate("/app/assessments/me")}>
              View my attempts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Assessment</h1>
        <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Time is enforced when you submit
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sortedQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {index + 1}. {question.questionText}{" "}
                <span className="font-body text-xs font-normal text-muted-foreground">
                  ({question.marks} marks)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = (selections[question.id] ?? []).includes(optionIndex);
                const single = question.type !== "MCQ_MULTIPLE";
                return (
                  <label
                    key={optionIndex}
                    className="flex items-center gap-2 rounded-md border border-border p-2 font-body text-sm text-foreground"
                  >
                    {single ? (
                      <input
                        type="radio"
                        name={question.id}
                        checked={selected}
                        onChange={() => toggleOption(question.id, optionIndex, true)}
                      />
                    ) : (
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleOption(question.id, optionIndex, false)}
                      />
                    )}
                    {option}
                  </label>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={submitting || !attempt} className="self-start">
        {submitting ? "Submitting…" : "Submit Assessment"}
      </Button>
    </div>
  );
}
