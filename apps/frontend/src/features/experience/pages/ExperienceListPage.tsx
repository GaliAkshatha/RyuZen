import { useState } from "react";
import { Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMyExperience } from "@/features/experience/hooks/useMyExperience";
import { useCreateExperience } from "@/features/experience/hooks/useCreateExperience";
import { useUpdateExperience } from "@/features/experience/hooks/useUpdateExperience";
import { ExperienceForm } from "@/features/experience/components/ExperienceForm";
import { DeleteExperienceAction } from "@/features/experience/components/DeleteExperienceAction";
import type { ExperienceResponseDto } from "@/features/experience/types/experience.types";
import type {
  CreateExperienceFormValues,
  UpdateExperienceFormValues,
} from "@/features/experience/schemas/experience.schemas";

function ExperienceRow({ experience }: { experience: ExperienceResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateExperience, isPending, error } = useUpdateExperience(experience.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <ExperienceForm
          experience={experience}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) => {
            const { startDate, endDate, ...rest } = values as UpdateExperienceFormValues;
            updateExperience(
              {
                ...rest,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
              },
              {
                onSuccess: () => {
                  toast({ title: "Experience updated" });
                  setEditing(false);
                },
              },
            );
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-medium text-foreground">
          {experience.role} — {experience.company}
        </span>
        <span className="font-body text-xs text-muted-foreground">
          {experience.employmentType ? `${experience.employmentType} · ` : ""}
          {new Date(experience.startDate).toLocaleDateString()}
          {" – "}
          {experience.currentlyWorking
            ? "present"
            : experience.endDate
              ? new Date(experience.endDate).toLocaleDateString()
              : "present"}
        </span>
        {experience.description && (
          <p className="font-body text-sm text-foreground">{experience.description}</p>
        )}
        {experience.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteExperienceAction experienceId={experience.id} />
      </div>
    </li>
  );
}

export function ExperienceListPage() {
  const { data: experience, isLoading, isError, error, refetch } = useMyExperience();
  const {
    mutate: createExperience,
    isPending: isCreating,
    error: createError,
  } = useCreateExperience();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Briefcase className="h-6 w-6 text-primary" aria-hidden="true" />
        My Experience
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Add an Experience Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <ExperienceForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) => {
                const { startDate, endDate, ...rest } = values as CreateExperienceFormValues;
                createExperience(
                  {
                    ...rest,
                    startDate: startDate.toISOString(),
                    endDate: endDate?.toISOString(),
                  },
                  {
                    onSuccess: () => {
                      toast({ title: "Experience added" });
                      setShowAddForm(false);
                    },
                  },
                );
              }}
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Add experience
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-24" />
          ))}
        </div>
      ) : !experience || experience.length === 0 ? (
        <EmptyState
          title="No experience entries yet"
          description="Add your work experience to build your profile."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {experience.map((entry) => (
            <ExperienceRow key={entry.id} experience={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}
