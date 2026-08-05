import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ClipboardList, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { useAssessments } from "@/features/assessments/hooks/useAssessments";
import { useAddAssessmentQuestion } from "@/features/assessments/hooks/useAddAssessmentQuestion";
import { usePublishAssessment } from "@/features/assessments/hooks/usePublishAssessment";
import {
  addQuestionSchema,
  type AddQuestionFormValues,
} from "@/features/assessments/schemas/assessment.schemas";

/**
 * Options and correct answers are entered as plain text (one option
 * per line, correct answer numbers comma-separated, 1-indexed for a
 * non-technical faculty user) and parsed into the real
 * options[]/correctOptionIndexes[] arrays the backend expects -
 * confirmed the backend validates these are real indexes into the
 * real options array (AddAssessmentQuestionUseCase), so a mistyped
 * number here is genuinely rejected, not silently accepted.
 */
export function ManageAssessmentPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { toast } = useToast();

  const { data: assessments } = useAssessments();
  const assessment = assessments?.find((a) => a.id === assessmentId);

  const { mutate: addQuestion, isPending: adding, error: addError } =
    useAddAssessmentQuestion(assessmentId!);
  const { mutate: publish, isPending: publishing } = usePublishAssessment();

  const [addedCount, setAddedCount] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useAppForm<AddQuestionFormValues>({
    resolver: zodResolver(addQuestionSchema),
    defaultValues: { type: "MCQ_SINGLE", marks: 1 },
  });

  function onSubmit(values: AddQuestionFormValues) {
    const options = values.optionsText
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);

    const correctOptionIndexes = values.correctOptionIndexesText
      .split(",")
      .map((n) => Number(n.trim()) - 1)
      .filter((n) => !Number.isNaN(n));

    addQuestion(
      { questionText: values.questionText, type: values.type, options, correctOptionIndexes, marks: values.marks, order: addedCount + 1 },
      {
        onSuccess: () => {
          toast({ title: "Question added" });
          setAddedCount((c) => c + 1);
          reset({ type: values.type, marks: 1, questionText: "", optionsText: "", correctOptionIndexesText: "" });
        },
      },
    );
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(addError);

  if (!assessment) {
    return null;
  }

  return (
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
          {assessment.title}
        </h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={assessment.status} />
          <Button variant="outline" asChild size="sm">
            <Link to={`/app/assessments/${assessmentId}/results`}>Results</Link>
          </Button>
        </div>
      </div>

      {assessment.status === "DRAFT" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add Question ({addedCount} added so far)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
                {(fieldErrors.length > 0 || apiErrors.length > 0) && (
                  <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
                )}
                <Textarea placeholder="Question text" rows={2} {...register("questionText")} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-label="Question type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ_SINGLE">Single Correct Answer</SelectItem>
                          <SelectItem value="MCQ_MULTIPLE">Multiple Correct Answers</SelectItem>
                          <SelectItem value="TRUE_FALSE">True / False</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input type="number" min={1} placeholder="Marks" {...register("marks")} />
                </div>
                <Textarea
                  placeholder={"Options, one per line, e.g.:\nParis\nLondon\nBerlin"}
                  rows={4}
                  {...register("optionsText")}
                />
                <Input
                  placeholder="Correct option number(s), e.g. 1 or 1,3"
                  {...register("correctOptionIndexesText")}
                />
                <Button type="submit" disabled={adding} className="self-start">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  {adding ? "Adding…" : "Add Question"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            disabled={publishing || addedCount === 0}
            onClick={() =>
              publish(assessmentId!, { onSuccess: () => toast({ title: "Assessment published" }) })
            }
            className="self-start"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
            {publishing ? "Publishing…" : "Publish Assessment"}
          </Button>
        </>
      )}
    </div>
  );
}
