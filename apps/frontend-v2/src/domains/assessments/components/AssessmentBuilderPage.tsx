import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, Send } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAssessments } from "@/domains/assessments/hooks/useAssessments";
import { useAssessmentResults } from "@/domains/assessments/hooks/useAssessmentResults";
import { useAddAssessmentQuestion, usePublishAssessment } from "@/domains/assessments/hooks/useAssessmentMutations";
import { QuestionType, AssessmentStatus } from "@/domains/assessments/assessment.types";
import type { AssessmentQuestion } from "@/domains/assessments/assessment.types";
import type { AppApiError } from "@/shared/types/api.types";

interface QuestionFormValues {
  questionText: string;
  type: string;
  marks: string;
  options: string[];
  correctOptionIndexes: string | string[];
}

/**
 * Real gap filled: AddAssessmentQuestionUseCase/PublishAssessmentUseCase
 * existed on the backend with zero frontend anywhere. Questions are
 * tracked locally as they're added (the real create response, not
 * refetched) since there's no real "list questions" endpoint on the
 * backend to read them back from afterward - confirmed directly, only
 * create/attempt-view exist, so this page is genuinely the only
 * record of what's been added during a single builder session.
 */
export function AssessmentBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: assessments } = useAssessments();
  const { data: results } = useAssessmentResults(id ?? "");
  const { mutate: addQuestion, isPending: isAdding, error: addError } = useAddAssessmentQuestion(id ?? "");
  const { mutate: publish, isPending: isPublishing } = usePublishAssessment();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [optionCount, setOptionCount] = useState(4);

  const assessment = (assessments ?? []).find((a) => a.id === id);

  const { register, handleSubmit, reset, watch } = useForm<QuestionFormValues>({
    defaultValues: { type: QuestionType.MCQ_SINGLE, options: ["", "", "", ""], correctOptionIndexes: [] },
  });

  const questionType = watch("type");

  function onSubmit(values: QuestionFormValues) {
    const correctIndexes = Array.isArray(values.correctOptionIndexes)
      ? values.correctOptionIndexes.map(Number)
      : values.correctOptionIndexes !== undefined && values.correctOptionIndexes !== ""
        ? [Number(values.correctOptionIndexes)]
        : [];

    addQuestion(
      {
        questionText: values.questionText,
        type: values.type as AssessmentQuestion["type"],
        options: values.options.filter(Boolean),
        correctOptionIndexes: correctIndexes,
        marks: Number(values.marks),
      },
      {
        onSuccess: (question) => {
          setQuestions((prev) => [...prev, question]);
          reset({ type: values.type, options: ["", "", "", ""], correctOptionIndexes: [] });
        },
      },
    );
  }

  if (!assessment) {
    return <EmptyState title="Assessment not found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/faculty/assessments" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{assessment.title}</h1>
          <p className="text-sm text-muted-foreground">
            {assessment.durationMinutes} min · {assessment.status}
          </p>
        </div>
        {assessment.status === AssessmentStatus.DRAFT && (
          <Button size="sm" disabled={isPublishing || questions.length === 0} onClick={() => publish(assessment.id)} className="ml-auto flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            {isPublishing ? "Publishing…" : "Publish"}
          </Button>
        )}
      </div>

      {assessment.status === AssessmentStatus.DRAFT && (
        <Card>
          <CardHeader>
            <CardTitle>Add a question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {addError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  {(addError as AppApiError).message}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="q-text">Question</Label>
                <Input id="q-text" {...register("questionText", { required: true })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="q-type">Type</Label>
                  <select id="q-type" className="h-9 rounded-md border border-input bg-transparent px-2 text-sm" {...register("type")}>
                    <option value={QuestionType.MCQ_SINGLE}>Single answer</option>
                    <option value={QuestionType.MCQ_MULTIPLE}>Multiple answers</option>
                    <option value={QuestionType.TRUE_FALSE}>True / False</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="q-marks">Marks</Label>
                  <Input id="q-marks" type="number" min={1} {...register("marks", { required: true })} />
                </div>
                {questionType !== QuestionType.TRUE_FALSE && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Options</Label>
                    <Input type="number" min={2} max={10} value={optionCount} onChange={(e) => setOptionCount(Number(e.target.value))} />
                  </div>
                )}
              </div>

              {questionType === QuestionType.TRUE_FALSE ? (
                <div className="flex flex-col gap-2">
                  {["True", "False"].map((label, i) => (
                    <label key={label} className="flex items-center gap-2 text-sm">
                      <input type="radio" value={i} {...register("correctOptionIndexes")} />
                      {label}
                    </label>
                  ))}
                  <input type="hidden" value="True" {...register("options.0")} />
                  <input type="hidden" value="False" {...register("options.1")} />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: optionCount }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type={questionType === QuestionType.MCQ_MULTIPLE ? "checkbox" : "radio"}
                        value={i}
                        {...register("correctOptionIndexes")}
                      />
                      <Input placeholder={`Option ${i + 1}`} {...register(`options.${i}` as const)} />
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" size="sm" disabled={isAdding} className="flex w-fit items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {isAdding ? "Adding…" : "Add question"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Questions added this session ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <EmptyState title="No questions added yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {questions.map((q) => (
                <div key={q.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-foreground">{q.questionText}</span>
                  <span className="text-xs text-muted-foreground">{q.marks} marks</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {assessment.status !== AssessmentStatus.DRAFT && (
        <Card>
          <CardHeader>
            <CardTitle>Results ({results?.length ?? 0} attempts)</CardTitle>
          </CardHeader>
          <CardContent>
            {!results || results.length === 0 ? (
              <EmptyState title="No attempts yet" />
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {results.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-mono text-xs text-foreground">{r.studentId}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.score !== undefined ? `${r.score} / ${assessment.totalMarks}` : "—"} · {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
