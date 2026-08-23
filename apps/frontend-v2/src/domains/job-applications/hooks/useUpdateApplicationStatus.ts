import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { jobApplicationService } from "@/domains/job-applications/jobApplicationService";
import { MY_APPLICANTS_QUERY_KEY } from "@/domains/recruiters/hooks/useMyApplicants";
import type { UpdateJobApplicationStatusRequest, JobApplication } from "@/domains/job-applications/jobApplication.types";

export function useUpdateApplicationStatus(placementId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<JobApplication, { id: string; payload: UpdateJobApplicationStatusRequest }>({
    mutationFn: ({ id, payload }) => jobApplicationService.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "drive", placementId] });
      queryClient.invalidateQueries({ queryKey: MY_APPLICANTS_QUERY_KEY });
    },
  });
}
