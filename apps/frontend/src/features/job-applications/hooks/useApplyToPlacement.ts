import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { jobApplicationService } from "@/features/job-applications/services/jobApplication.service";
import { MY_JOB_APPLICATIONS_QUERY_KEY } from "@/features/job-applications/hooks/useMyJobApplications";
import type {
  ApplyToPlacementPayload,
  JobApplicationResponseDto,
} from "@/features/job-applications/types/jobApplication.types";

export function useApplyToPlacement(placementId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<JobApplicationResponseDto, ApplyToPlacementPayload>({
    mutationFn: (payload) => jobApplicationService.apply(placementId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_JOB_APPLICATIONS_QUERY_KEY });
    },
  });
}
