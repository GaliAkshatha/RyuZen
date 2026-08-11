import { useNavigate } from "react-router-dom";
import { BadgeCheck, Clock } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";

import type { SkillResponseDto } from "@/features/skills/types/skill.types";

/** Verified (faculty-approved) skills shown distinctly from approved-but-unverified ones - real signal, not decoration. */
export function GrowthSkillsTab({ skills }: { skills: SkillResponseDto[] }) {
  const navigate = useNavigate();

  if (skills.length === 0) {
    return (
      <EmptyState
        title="No skills yet"
        description="Skills are added manually or suggested by AI from your projects and resume."
        actionLabel="Add a skill"
        onAction={() => navigate("/app/career/skills")}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5"
        >
          {skill.verified ? (
            <BadgeCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          )}
          <span className="font-body text-sm text-foreground">{skill.name}</span>
          {skill.level && (
            <Badge variant="outline" className="text-[10px]">
              {humanizeEnumValue(skill.level)}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}
