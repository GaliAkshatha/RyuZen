import { useState } from "react";
import { BookOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMyEducation } from "@/features/education/hooks/useMyEducation";
import { useCreateEducation } from "@/features/education/hooks/useCreateEducation";
import { useUpdateEducation } from "@/features/education/hooks/useUpdateEducation";
import { EducationForm } from "@/features/education/components/EducationForm";
import { DeleteEducationAction } from "@/features/education/components/DeleteEducationAction";
import type { EducationResponseDto } from "@/features/education/types/education.types";
import type {
  CreateEducationFormValues,
  UpdateEducationFormValues,
} from "@/features/education/schemas/education.schemas";

function EducationRow({ education }: { education: EducationResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateEducation, isPending, error } = useUpdateEducation(education.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <EducationForm
          education={education}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) =>
            updateEducation(values as UpdateEducationFormValues, {
              onSuccess: () => {
                toast({ title: "Education entry updated" });
                setEditing(false);
              },
            })
          }
        />
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col">
        <span className="font-body text-sm font-medium text-foreground">
          {education.degree} — {education.institution}
        </span>
        <span className="font-body text-xs text-muted-foreground">
          {education.branch ? `${education.branch} · ` : ""}
          {education.startYear}
          {education.endYear ? ` – ${education.endYear}` : " – present"}
          {education.cgpa !== undefined ? ` · CGPA ${education.cgpa}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteEducationAction educationId={education.id} />
      </div>
    </li>
  );
}

export function EducationListPage() {
  const { data: education, isLoading, isError, error, refetch } = useMyEducation();
  const {
    mutate: createEducation,
    isPending: isCreating,
    error: createError,
  } = useCreateEducation();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
        My Education
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Add an Education Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <EducationForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) =>
                createEducation(values as CreateEducationFormValues, {
                  onSuccess: () => {
                    toast({ title: "Education entry added" });
                    setShowAddForm(false);
                  },
                })
              }
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Add education
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-16" />
          ))}
        </div>
      ) : !education || education.length === 0 ? (
        <EmptyState
          title="No education entries yet"
          description="Add your academic background to build your profile."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {education.map((entry) => (
            <EducationRow key={entry.id} education={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}
