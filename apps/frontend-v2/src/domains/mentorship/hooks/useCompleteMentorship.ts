import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mentorshipService } from "@/domains/mentorship/mentorshipService";
import { MENTORSHIPS_QUERY_KEY } from "@/domains/mentorship/hooks/useMyMentorships";
import type { Mentorship } from "@/domains/mentorship/mentorship.types";

export function useCompleteMentorship() {
  const queryClient = useQueryClient();
  return useApiMutation<Mentorship, string>({
    mutationFn: (id) => mentorshipService.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENTORSHIPS_QUERY_KEY }),
  });
}
