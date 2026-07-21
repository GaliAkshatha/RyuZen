import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { alumniService } from "@/features/alumni/services/alumni.service";
import { ALUMNI_QUERY_KEY } from "@/features/alumni/hooks/useAlumniList";
import type {
  InviteAlumniPayload,
  InviteAlumniResponseDto,
} from "@/features/alumni/types/alumni.types";

export function useInviteAlumni() {
  const queryClient = useQueryClient();

  return useApiMutation<InviteAlumniResponseDto, InviteAlumniPayload>({
    mutationFn: alumniService.invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY });
    },
  });
}
