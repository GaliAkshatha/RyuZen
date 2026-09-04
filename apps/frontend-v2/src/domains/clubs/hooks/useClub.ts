import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { clubService } from "@/domains/clubs/clubService";
import type { Club } from "@/domains/clubs/club.types";

export function useClub(id: string) {
  return useApiQuery<Club>({
    queryKey: ["clubs", id] as const,
    queryFn: () => clubService.getById(id),
    enabled: Boolean(id),
  });
}
