import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { codingProfileService } from "@/domains/coding-profiles/codingProfileService";
import type { CodingProfile } from "@/domains/coding-profiles/codingProfile.types";

export const MY_CODING_PROFILES_QUERY_KEY = ["coding-profiles", "me"] as const;

export function useMyCodingProfiles() {
  return useApiQuery<CodingProfile[]>({
    queryKey: MY_CODING_PROFILES_QUERY_KEY,
    queryFn: codingProfileService.getMine,
  });
}
