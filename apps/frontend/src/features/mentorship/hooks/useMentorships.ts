import { useApiQuery } from "@/hooks/useApiQuery";

import { mentorshipService } from "@/features/mentorship/services/mentorship.service";
import type { MentorshipListFilters } from "@/features/mentorship/types/mentorship.types";

export const MENTORSHIPS_QUERY_KEY = ["mentorships"] as const;

export function useMentorships(filters?: MentorshipListFilters) {
  return useApiQuery({
    queryKey: [...MENTORSHIPS_QUERY_KEY, filters] as const,
    queryFn: () => mentorshipService.list(filters),
  });
}
