import { CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { MentorshipStatus } from "@/types/enums";

import { useCompleteMentorship } from "@/features/mentorship/hooks/useCompleteMentorship";
import type { MentorshipResponseDto } from "@/features/mentorship/types/mentorship.types";

export function CompleteMentorshipAction({ mentorship }: { mentorship: MentorshipResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useCompleteMentorship(mentorship.id);

  if (mentorship.status !== MentorshipStatus.ACTIVE) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        mutate(undefined, { onSuccess: () => toast({ title: "Mentorship marked complete" }) })
      }
    >
      <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Completing…" : "Mark Complete"}
    </Button>
  );
}
