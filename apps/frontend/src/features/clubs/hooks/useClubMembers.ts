import { useApiQuery } from "@/hooks/useApiQuery";

import { clubService } from "@/features/clubs/services/club.service";

export function useClubMembers(clubId: string) {
  return useApiQuery({
    queryKey: ["clubs", clubId, "members"] as const,
    queryFn: () => clubService.listMembers(clubId),
    enabled: Boolean(clubId),
  });
}
