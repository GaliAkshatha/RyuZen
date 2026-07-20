import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { alumniService } from "@/features/alumni/services/alumni.service";
import { ALUMNI_QUERY_KEY } from "@/features/alumni/hooks/useAlumniList";
import type { AlumniResponseDto } from "@/features/alumni/types/alumni.types";

export function useVerifyAlumni(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AlumniResponseDto, void>({
    mutationFn: () => alumniService.verify(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY });
      queryClient.setQueryData(["alumni", id], updated);
    },
  });
}
