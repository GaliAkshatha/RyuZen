import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import type { ProfileResponseDto } from "@/features/auth/types/auth.types";
import { profileService } from "@/features/profile/services/profile.service";
import type { UpdateProfilePayload } from "@/features/profile/types/profile.types";

/**
 * Writes the updated profile directly into the CURRENT_USER_QUERY_KEY
 * cache on success (`setQueryData`, synchronous) rather than only
 * `invalidateQueries` (which would need a network round-trip before the
 * UI reflects the change). Since AppTopbar and every future profile
 * display read from this exact same query, this is what makes the
 * DoD's "updates the topbar immediately without a full page reload"
 * true — there's only one source of "who is the current user"
 * anywhere in the app, and this mutation updates it directly.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useApiMutation<ProfileResponseDto, UpdateProfilePayload>({
    mutationFn: profileService.updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, updatedProfile);
    },
  });
}
