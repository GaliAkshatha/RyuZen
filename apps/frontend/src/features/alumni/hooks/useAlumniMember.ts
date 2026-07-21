import { useApiQuery } from "@/hooks/useApiQuery";

import { alumniService } from "@/features/alumni/services/alumni.service";

export function useAlumniMember(id: string) {
  return useApiQuery({
    queryKey: ["alumni", id] as const,
    queryFn: () => alumniService.getById(id),
    enabled: Boolean(id),
  });
}
