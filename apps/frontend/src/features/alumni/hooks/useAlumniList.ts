import { useApiQuery } from "@/hooks/useApiQuery";

import { alumniService } from "@/features/alumni/services/alumni.service";

export const ALUMNI_QUERY_KEY = ["alumni"] as const;

export function useAlumniList() {
  return useApiQuery({
    queryKey: ALUMNI_QUERY_KEY,
    queryFn: alumniService.list,
  });
}
