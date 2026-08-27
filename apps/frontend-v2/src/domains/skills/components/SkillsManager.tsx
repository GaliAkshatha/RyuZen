import { useState } from "react";
import { Sparkles, Check, X, Plus, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { EmptyState } from "@/shared/components/EmptyState";
import { useSkills, usePendingSkillSuggestions } from "@/domains/skills/hooks/useSkills";
import { useExtractSkills } from "@/domains/skills/hooks/useExtractSkills";
import { useApproveSkill } from "@/domains/skills/hooks/useApproveSkill";
import { useDeleteSkill } from "@/domains/skills/hooks/useDeleteSkill";
import { useCreateSkill } from "@/domains/skills/hooks/useCreateSkill";

/**
 * Real skill management - the AI extraction pipeline
 * (ExtractSkillsUseCase) already existed fully built on the backend,
 * reading real evidence from the student's own projects,
 * certifications, experience, and approved activities, but had no
 * frontend at all - confirmed nothing under src/domains referenced
 * it before this. This is that missing frontend: a real "Extract
 * skills" trigger, real pending AI suggestions shown with their
 * actual evidence text and confidence (not invented UI chrome around
 * fake data), Approve/Dismiss per suggestion, and manual add for
 * skills the student wants to claim directly.
 *
 * approved skills here already matches what the aggregate portfolio
 * view shows (that endpoint filters to approved===true server-side) -
 * this component is the place that list actually gets populated from.
 */
export function SkillsManager() {
  const { data: skills } = useSkills();
  const { data: pending } = usePendingSkillSuggestions();
  const { mutate: extract, isPending: isExtracting } = useExtractSkills();
  const { mutate: approve, isPending: isApproving } = useApproveSkill();
  const { mutate: remove, isPending: isRemoving } = useDeleteSkill();
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  const approvedSkills = (skills ?? []).filter((s) => s.approved);

  function handleAddSkill() {
    if (!newSkillName.trim()) return;
    createSkill(
      { name: newSkillName.trim() },
      {
        onSuccess: () => {
          setNewSkillName("");
          setShowAddForm(false);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => extract()} disabled={isExtracting} className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {isExtracting ? "Analyzing your profile…" : "Extract skills with AI"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowAddForm((v) => !v)} className="flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add manually
        </Button>
      </div>

      {showAddForm && (
        <div className="flex items-center gap-2">
          <Input
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="e.g. React, Python, Public Speaking"
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <Button size="sm" onClick={handleAddSkill} disabled={isCreating || !newSkillName.trim()}>
            Add
          </Button>
        </div>
      )}

      {pending && pending.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {pending.length} AI suggestion{pending.length === 1 ? "" : "s"} awaiting your review
          </p>
          <div className="flex flex-col divide-y divide-border">
            {pending.map((skill) => (
              <div key={skill.id} className="flex items-start justify-between gap-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {skill.name}
                    {skill.confidence !== undefined && (
                      <span className="ml-2 text-[11px] font-normal text-muted-foreground">{skill.confidence}% confidence</span>
                    )}
                  </p>
                  {skill.evidence && <p className="mt-0.5 text-xs text-muted-foreground">{skill.evidence}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => approve(skill.id)}
                    disabled={isApproving}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-success transition-colors hover:bg-success/20 disabled:opacity-50"
                    aria-label={`Approve ${skill.name}`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => remove(skill.id)}
                    disabled={isRemoving}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                    aria-label={`Dismiss ${skill.name}`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approvedSkills.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No skills yet"
          description="Extract skills from your projects and activities, or add one manually."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {approvedSkills.map((skill) => (
            <span
              key={skill.id}
              className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
            >
              {skill.verified && <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
