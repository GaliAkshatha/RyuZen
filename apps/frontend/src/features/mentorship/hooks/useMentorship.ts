import { useApiQuery } from "@/hooks/useApiQuery";

import { mentorshipService } from "@/features/mentorship/services/mentorship.service";

export function useMentorship(id: string) {
  return useApiQuery({
    queryKey: ["mentorships", id] as const,
    queryFn: () => mentorshipService.getById(id),
    enabled: Boolean(id),
  });
}
