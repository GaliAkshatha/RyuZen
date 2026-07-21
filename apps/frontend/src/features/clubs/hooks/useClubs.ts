import { useApiQuery } from "@/hooks/useApiQuery";

import { clubService } from "@/features/clubs/services/club.service";

export const CLUBS_QUERY_KEY = ["clubs"] as const;

export function useClubs() {
  return useApiQuery({
    queryKey: CLUBS_QUERY_KEY,
    queryFn: clubService.list,
  });
}
