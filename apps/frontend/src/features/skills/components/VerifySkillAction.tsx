import { BadgeCheck } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";

import { useVerifySkill } from "@/features/skills/hooks/useVerifySkill";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";

export function VerifySkillAction({
  skill,
  ownerUserId,
}: {
  skill: SkillResponseDto;
  ownerUserId: string;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useVerifySkill(ownerUserId);

  if (skill.verified) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => mutate(skill.id, { onSuccess: () => toast({ title: "Skill verified" }) })}
    >
      <BadgeCheck className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Verifying…" : "Verify"}
    </Button>
  );
}
