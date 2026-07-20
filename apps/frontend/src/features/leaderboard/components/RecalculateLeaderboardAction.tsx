import { RotateCw } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";

import { useRecalculateLeaderboard } from "@/features/leaderboard/hooks/useRecalculateLeaderboard";

export function RecalculateLeaderboardAction() {
  const { toast } = useToast();
  const { mutate, isPending } = useRecalculateLeaderboard();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        mutate(undefined, { onSuccess: () => toast({ title: "Leaderboard recalculated" }) })
      }
    >
      <RotateCw className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Recalculating…" : "Recalculate"}
    </Button>
  );
}
