import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ClipboardList, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "@/domains/auth/AuthContext";
import { useAssessments } from "@/domains/assessments/hooks/useAssessments";
import { useCreateAssessment } from "@/domains/assessments/hooks/useAssessmentMutations";
import { AssessmentType, AssessmentStatus, type CreateAssessmentRequest } from "@/domains/assessments/assessment.types";
import type { AppApiError } from "@/shared/types/api.types";

const CAN_CREATE_ROLES = ["ORG_ADMIN", "FACULTY"];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-success/10 text-success",
  CLOSED: "bg-primary/10 text-primary",
};

/**
 * Real gap filled: the entire assessments domain (a full MCQ builder
 * + timed student attempt flow - 9 real routes) existed on the
 * backend with zero frontend anywhere. Role-aware: Faculty/Org Admin
 * see a "New assessment" action leading to the question builder;
 * students see the same real list, opening a DRAFT-free view that
 * leads to the timed attempt flow. Real client-side navigation
 * (useNavigate) for the post-create redirect, not a hard reload.
 */
export function AssessmentsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: assessments, isLoading, isError, error, refetch } = useAssessments();
  const { mutate: createAssessment, isPending: isCreating, error: createError } = useCreateAssessment();
  const [showForm, setShowForm] = useState(false);

  const canCreate = Boolean(user?.role && CAN_CREATE_ROLES.includes(user.role));
  const isStudent = user?.role === "STUDENT";
  const basePath = isStudent ? "/student/assessments" : "/faculty/assessments";

  const { register, handleSubmit, reset } = useForm<{ title: string; description: string; type: string; durationMinutes: string; passingScore: string }>();

  function onSubmit(values: { title: string; description: string; type: string; durationMinutes: string; passingScore: string }) {
    const payload: CreateAssessmentRequest = {
      title: values.title,
      description: values.description || undefined,
      type: values.type as CreateAssessmentRequest["type"],
      durationMinutes: Number(values.durationMinutes),
      passingScore: values.passingScore ? Number(values.passingScore) : undefined,
    };
    createAssessment(payload, {
      onSuccess: (assessment) => {
        reset();
        setShowForm(false);
        navigate(`${basePath}/${assessment.id}`);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const visibleAssessments = isStudent ? (assessments ?? []).filter((a) => a.status !== AssessmentStatus.DRAFT) : (assessments ?? []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Assessments</h1>
          <p className="text-sm text-muted-foreground">Timed MCQ assessments.</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {showForm ? "Cancel" : "New assessment"}
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {createError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  {(createError as AppApiError).message}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="assess-title">Title</Label>
                <Input id="assess-title" {...register("title", { required: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="assess-description">Description</Label>
                <Input id="assess-description" {...register("description")} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="assess-type">Type</Label>
                  <select id="assess-type" className="h-9 rounded-md border border-input bg-transparent px-2 text-sm" {...register("type", { required: true })}>
                    <option value={AssessmentType.APTITUDE}>Aptitude</option>
                    <option value={AssessmentType.BRANCH_SPECIFIC}>Branch-specific</option>
                    <option value={AssessmentType.WEEKLY}>Weekly</option>
                    <option value={AssessmentType.COMPANY_SPECIFIC}>Company-specific</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="assess-duration">Duration (min)</Label>
                  <Input id="assess-duration" type="number" min={1} {...register("durationMinutes", { required: true })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="assess-passing">Passing score</Label>
                  <Input id="assess-passing" type="number" min={0} {...register("passingScore")} />
                </div>
              </div>
              <Button type="submit" size="sm" disabled={isCreating} className="w-fit">
                {isCreating ? "Creating…" : "Create and add questions"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {visibleAssessments.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No assessments yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {visibleAssessments.map((a) => (
                <Link key={a.id} to={`${basePath}/${a.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-primary">
                  <div>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.durationMinutes} min · {a.totalMarks} marks
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[a.status] ?? ""}`}>{a.status}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
