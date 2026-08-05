import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { flattenApiErrors } from "@/utils/flattenApiErrors";

import { useCreateAssessment } from "@/features/assessments/hooks/useCreateAssessment";
import {
  createAssessmentSchema,
  type CreateAssessmentFormValues,
} from "@/features/assessments/schemas/assessment.schemas";

const TYPES = [
  { value: "APTITUDE", label: "Aptitude" },
  { value: "BRANCH_SPECIFIC", label: "Branch Specific" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "COMPANY_SPECIFIC", label: "Company Specific" },
];

export function CreateAssessmentPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateAssessment();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<CreateAssessmentFormValues>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: { type: "APTITUDE", durationMinutes: 30 },
  });

  function onSubmit(values: CreateAssessmentFormValues) {
    mutate(values, {
      onSuccess: (assessment) => navigate(`/app/assessments/${assessment.id}/manage`),
    });
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
        Create Assessment
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {(fieldErrors.length > 0 || apiErrors.length > 0) && (
              <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
                Title
              </label>
              <Input id="title" {...register("title")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="font-body text-sm text-foreground">
                Description (optional)
              </label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm text-foreground">Type</label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="Type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="durationMinutes" className="font-body text-sm text-foreground">
                  Duration (minutes)
                </label>
                <Input id="durationMinutes" type="number" min={1} {...register("durationMinutes")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="passingScore" className="font-body text-sm text-foreground">
                  Passing Score (optional)
                </label>
                <Input id="passingScore" type="number" min={0} {...register("passingScore")} />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="self-start">
              {isPending ? "Creating…" : "Create & Add Questions"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
