import { useState } from "react";
import { Sparkles, BadgeCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";

import { useMySkills } from "@/features/skills/hooks/useMySkills";
import { useCreateSkill } from "@/features/skills/hooks/useCreateSkill";
import { useUpdateSkill } from "@/features/skills/hooks/useUpdateSkill";
import { SkillForm } from "@/features/skills/components/SkillForm";
import { SkillSuggestionsSection } from "@/features/skills/components/SkillSuggestionsSection";
import { DeleteSkillAction } from "@/features/skills/components/DeleteSkillAction";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";
import type {
  CreateSkillFormValues,
  UpdateSkillFormValues,
} from "@/features/skills/schemas/skill.schemas";

function SkillRow({ skill }: { skill: SkillResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateSkill, isPending, error } = useUpdateSkill(skill.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <SkillForm
          skill={skill}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) =>
            updateSkill(values as UpdateSkillFormValues, {
              onSuccess: () => {
                toast({ title: "Skill updated" });
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
        <span className="font-body text-sm font-medium text-foreground">{skill.name}</span>
        {skill.category && (
          <span className="font-body text-xs text-muted-foreground">{skill.category}</span>
        )}
        {skill.level && <Badge variant="outline">{skill.level}</Badge>}
        {skill.verified && (
          <span className="flex items-center gap-1 text-xs text-success">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteSkillAction skillId={skill.id} />
      </div>
    </li>
  );
}

export function SkillListPage() {
  const { data: skills, isLoading, isError, error, refetch } = useMySkills();
  const { mutate: createSkill, isPending: isCreating, error: createError } = useCreateSkill();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
        My Skills
      </h1>

      <SkillSuggestionsSection />

      <Card>
        <CardHeader>
          <CardTitle>Add a Skill</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <SkillForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) =>
                createSkill(values as CreateSkillFormValues, {
                  onSuccess: () => {
                    toast({ title: "Skill added" });
                    setShowAddForm(false);
                  },
                })
              }
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Add a skill
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
      ) : !skills || skills.length === 0 ? (
        <EmptyState
          title="No skills yet"
          description="Add a skill to start building your profile."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {skills.map((skill) => (
            <SkillRow key={skill.id} skill={skill} />
          ))}
        </ul>
      )}
    </div>
  );
}
