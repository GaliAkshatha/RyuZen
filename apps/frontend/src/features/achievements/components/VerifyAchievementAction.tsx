import { CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { AchievementStatus } from "@/types/enums";

import { useVerifyAchievement } from "@/features/achievements/hooks/useVerifyAchievement";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";

/**
 * Shown only for PENDING. The backend's verify()/reject() have no
 * state-transition restriction at all (confirmed this milestone — can
 * be called from any status). This is a UX choice, not a claimed
 * backend rule, same reasoning as CloseActivityAction (C2).
 */
export function VerifyAchievementAction({
  achievement,
  studentId,
}: {
  achievement: AchievementResponseDto;
  studentId: string;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useVerifyAchievement(studentId);

  if (achievement.status !== AchievementStatus.PENDING) {
    return null;
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() =>
        mutate(achievement.id, { onSuccess: () => toast({ title: "Achievement verified" }) })
      }
    >
      <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Verifying…" : "Verify"}
    </Button>
  );
}
