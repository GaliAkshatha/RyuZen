import { useApiMutation } from "@/hooks/useApiMutation";

import { profileService } from "@/features/profile/services/profile.service";
import type { ChangePasswordPayload } from "@/features/profile/types/profile.types";

export function useChangePassword() {
  return useApiMutation<null, ChangePasswordPayload>({
    mutationFn: profileService.changePassword,
  });
}
