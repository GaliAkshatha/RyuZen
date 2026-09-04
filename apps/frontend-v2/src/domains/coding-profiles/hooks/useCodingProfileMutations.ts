import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { codingProfileService } from "@/domains/coding-profiles/codingProfileService";
import { MY_CODING_PROFILES_QUERY_KEY } from "@/domains/coding-profiles/hooks/useMyCodingProfiles";
import type { CodingProfile, LinkCodingProfileRequest } from "@/domains/coding-profiles/codingProfile.types";

export function useLinkCodingProfile() {
  const queryClient = useQueryClient();
  return useApiMutation<CodingProfile, LinkCodingProfileRequest>({
    mutationFn: (payload) => codingProfileService.link(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_CODING_PROFILES_QUERY_KEY }),
  });
}

export function useSyncCodingProfile() {
  const queryClient = useQueryClient();
  return useApiMutation<CodingProfile, string>({
    mutationFn: (id) => codingProfileService.sync(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_CODING_PROFILES_QUERY_KEY }),
  });
}
