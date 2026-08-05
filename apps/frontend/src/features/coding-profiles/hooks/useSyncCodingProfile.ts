import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { codingProfileService } from "@/features/coding-profiles/services/codingProfile.service";
import { MY_CODING_PROFILES_QUERY_KEY } from "@/features/coding-profiles/hooks/useMyCodingProfiles";
import type { CodingProfileResponseDto } from "@/features/coding-profiles/types/codingProfile.types";

export function useSyncCodingProfile() {
  const queryClient = useQueryClient();

  return useApiMutation<CodingProfileResponseDto, string>({
    mutationFn: (profileId) => codingProfileService.sync(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_CODING_PROFILES_QUERY_KEY });
    },
  });
}
