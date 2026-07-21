import { useApiQuery } from "@/hooks/useApiQuery";

import { mockInterviewService } from "@/features/mock-interview/services/mockInterview.service";

export function useMockInterview(id: string | undefined) {
  return useApiQuery({
    queryKey: ["mock-interviews", id] as const,
    queryFn: () => mockInterviewService.getById(id ?? ""),
    enabled: Boolean(id),
  });
}
