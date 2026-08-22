import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mentorshipService } from "@/domains/mentorship/mentorshipService";
import { MENTORSHIPS_QUERY_KEY } from "@/domains/mentorship/hooks/useMyMentorships";
import type { UpdateMentorshipRequest, Mentorship } from "@/domains/mentorship/mentorship.types";

export function useUpdateMentorship() {
  const queryClient = useQueryClient();
  return useApiMutation<Mentorship, { id: string; payload: UpdateMentorshipRequest }>({
    mutationFn: ({ id, payload }) => mentorshipService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENTORSHIPS_QUERY_KEY }),
  });
}
