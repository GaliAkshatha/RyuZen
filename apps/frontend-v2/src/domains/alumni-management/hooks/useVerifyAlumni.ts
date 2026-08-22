import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import { ALUMNI_QUERY_KEY } from "@/domains/alumni-management/hooks/useAlumniList";
import type { AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export function useVerifyAlumni() {
  const queryClient = useQueryClient();
  return useApiMutation<AlumniRecord, string>({
    mutationFn: (id) => alumniManagementService.verify(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["alumni", id] });
    },
  });
}
