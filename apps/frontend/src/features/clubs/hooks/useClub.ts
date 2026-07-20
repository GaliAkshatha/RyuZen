import { useApiQuery } from "@/hooks/useApiQuery";

import { clubService } from "@/features/clubs/services/club.service";

export function useClub(id: string) {
  return useApiQuery({
    queryKey: ["clubs", id] as const,
    queryFn: () => clubService.getById(id),
    enabled: Boolean(id),
  });
}
