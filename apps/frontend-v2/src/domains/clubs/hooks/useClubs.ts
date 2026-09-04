import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { clubService } from "@/domains/clubs/clubService";
import type { Club } from "@/domains/clubs/club.types";

export const CLUBS_QUERY_KEY = ["clubs"] as const;

export function useClubs() {
  return useApiQuery<Club[]>({
    queryKey: CLUBS_QUERY_KEY,
    queryFn: clubService.list,
  });
}
