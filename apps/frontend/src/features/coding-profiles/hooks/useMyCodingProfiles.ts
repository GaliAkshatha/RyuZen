import { useApiQuery } from "@/hooks/useApiQuery";

import { codingProfileService } from "@/features/coding-profiles/services/codingProfile.service";

export const MY_CODING_PROFILES_QUERY_KEY = ["coding-profiles", "me"] as const;

export function useMyCodingProfiles() {
  return useApiQuery({
    queryKey: MY_CODING_PROFILES_QUERY_KEY,
    queryFn: codingProfileService.getMyProfiles,
  });
}
