import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import { ALUMNI_QUERY_KEY } from "@/domains/alumni-management/hooks/useAlumniList";
import type { UpdateAlumniRequest, AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export function useUpdateAlumni(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<AlumniRecord, UpdateAlumniRequest>({
    mutationFn: (payload) => alumniManagementService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["alumni", id] });
    },
  });
}
