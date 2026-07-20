import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { alumniService } from "@/features/alumni/services/alumni.service";
import { ALUMNI_QUERY_KEY } from "@/features/alumni/hooks/useAlumniList";
import type { AlumniResponseDto, UpdateAlumniPayload } from "@/features/alumni/types/alumni.types";

export function useUpdateAlumni(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AlumniResponseDto, UpdateAlumniPayload>({
    mutationFn: (payload) => alumniService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY });
      queryClient.setQueryData(["alumni", id], updated);
    },
  });
}
