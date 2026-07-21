import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { mentorshipService } from "@/features/mentorship/services/mentorship.service";
import { MENTORSHIPS_QUERY_KEY } from "@/features/mentorship/hooks/useMentorships";
import type {
  MentorshipResponseDto,
  UpdateMentorshipPayload,
} from "@/features/mentorship/types/mentorship.types";

export function useUpdateMentorship(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<MentorshipResponseDto, UpdateMentorshipPayload>({
    mutationFn: (payload) => mentorshipService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MENTORSHIPS_QUERY_KEY });
      queryClient.setQueryData(["mentorships", id], updated);
    },
  });
}
