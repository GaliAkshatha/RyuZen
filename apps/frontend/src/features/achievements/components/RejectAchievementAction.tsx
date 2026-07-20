import { XCircle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { AchievementStatus } from "@/types/enums";

import { useRejectAchievement } from "@/features/achievements/hooks/useRejectAchievement";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";

/** Shown only for PENDING — same UX-choice reasoning as VerifyAchievementAction. */
export function RejectAchievementAction({
  achievement,
  studentId,
}: {
  achievement: AchievementResponseDto;
  studentId: string;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useRejectAchievement(studentId);

  if (achievement.status !== AchievementStatus.PENDING) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        mutate(achievement.id, { onSuccess: () => toast({ title: "Achievement rejected" }) })
      }
    >
      <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Rejecting…" : "Reject"}
    </Button>
  );
}
