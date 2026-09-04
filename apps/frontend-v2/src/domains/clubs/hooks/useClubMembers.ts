import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { clubService } from "@/domains/clubs/clubService";
import type { ClubMember } from "@/domains/clubs/club.types";

export function useClubMembers(id: string) {
  return useApiQuery<ClubMember[]>({
    queryKey: ["clubs", id, "members"] as const,
    queryFn: () => clubService.listMembers(id),
    enabled: Boolean(id),
  });
}
