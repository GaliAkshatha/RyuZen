import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { jobApplicationService } from "@/features/job-applications/services/jobApplication.service";
import type {
  JobApplicationResponseDto,
  UpdateJobApplicationStatusPayload,
} from "@/features/job-applications/types/jobApplication.types";

export function useUpdateJobApplicationStatus(placementId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<
    JobApplicationResponseDto,
    { id: string; payload: UpdateJobApplicationStatusPayload }
  >({
    mutationFn: ({ id, payload }) => jobApplicationService.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications", "placements", placementId] });
    },
  });
}
