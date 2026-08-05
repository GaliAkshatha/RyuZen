import { useApiQuery } from "@/hooks/useApiQuery";

import { connectionService } from "@/features/connections/services/connection.service";

export const PEOPLE_QUERY_KEY = ["connections", "people"] as const;

export function usePeople() {
  return useApiQuery({
    queryKey: PEOPLE_QUERY_KEY,
    queryFn: connectionService.getPeople,
  });
}
