import { useState } from "react";
import { LayoutTemplate } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useResumeTemplates } from "@/features/resume/hooks/useResumeTemplates";
import { useCreateResumeTemplate } from "@/features/resume/hooks/useCreateResumeTemplate";
import { useUpdateResumeTemplate } from "@/features/resume/hooks/useUpdateResumeTemplate";
import { ResumeTemplateForm } from "@/features/resume/components/ResumeTemplateForm";
import { DeleteResumeTemplateAction } from "@/features/resume/components/DeleteResumeTemplateAction";
import type { ResumeTemplateResponseDto } from "@/features/resume/types/resume.types";
import type {
  CreateResumeTemplateFormValues,
  UpdateResumeTemplateFormValues,
} from "@/features/resume/schemas/resume.schemas";

function TemplateRow({ template }: { template: ResumeTemplateResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateTemplate, isPending, error } = useUpdateResumeTemplate(template.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <ResumeTemplateForm
          template={template}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) =>
            updateTemplate(values as UpdateResumeTemplateFormValues, {
              onSuccess: () => {
                toast({ title: "Template updated" });
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
      <div className="flex items-center gap-2">
        <span className="font-body text-sm font-medium text-foreground">{template.name}</span>
        {template.premium && <Badge variant="outline">Premium</Badge>}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteResumeTemplateAction templateId={template.id} />
      </div>
    </li>
  );
}

export function ResumeTemplateListPage() {
  const { data: templates, isLoading, isError, error, refetch } = useResumeTemplates();
  const {
    mutate: createTemplate,
    isPending: isCreating,
    error: createError,
  } = useCreateResumeTemplate();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <LayoutTemplate className="h-6 w-6 text-primary" aria-hidden="true" />
        Resume Templates
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Add a Template</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <ResumeTemplateForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) =>
                createTemplate(values as CreateResumeTemplateFormValues, {
                  onSuccess: () => {
                    toast({ title: "Template created" });
                    setShowAddForm(false);
                  },
                })
              }
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Add template
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-14" />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <EmptyState
          title="No templates yet"
          description="Create the first resume template in the catalog."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {templates.map((template) => (
            <TemplateRow key={template.id} template={template} />
          ))}
        </ul>
      )}
    </div>
  );
}
