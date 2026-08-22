import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import { ALUMNI_QUERY_KEY } from "@/domains/alumni-management/hooks/useAlumniList";
import type { CreateAlumniRequest, AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export function useCreateAlumni() {
  const queryClient = useQueryClient();
  return useApiMutation<AlumniRecord, CreateAlumniRequest>({
    mutationFn: (payload) => alumniManagementService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ALUMNI_QUERY_KEY }),
  });
}
