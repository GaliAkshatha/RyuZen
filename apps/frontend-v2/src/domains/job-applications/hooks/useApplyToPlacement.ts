import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { jobApplicationService } from "@/domains/job-applications/jobApplicationService";
import { MY_APPLICATIONS_QUERY_KEY } from "@/domains/job-applications/hooks/useMyApplications";
import type { ApplyToPlacementRequest, JobApplication } from "@/domains/job-applications/jobApplication.types";

export function useApplyToPlacement(placementId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<JobApplication, ApplyToPlacementRequest>({
    mutationFn: (payload) => jobApplicationService.apply(placementId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_QUERY_KEY });
    },
  });
}
