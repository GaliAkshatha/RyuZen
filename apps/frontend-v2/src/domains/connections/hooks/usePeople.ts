import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { connectionService } from "@/domains/connections/connectionService";
import type { ConnectableUser } from "@/domains/connections/connection.types";

export const PEOPLE_QUERY_KEY = ["connections", "people"] as const;

export function usePeople() {
  return useApiQuery<ConnectableUser[]>({
    queryKey: PEOPLE_QUERY_KEY,
    queryFn: connectionService.listPeople,
  });
}
