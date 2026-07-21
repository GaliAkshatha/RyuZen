import { useApiMutation } from "@/hooks/useApiMutation";

import { userPermissionsService } from "@/features/user-permissions/services/userPermissions.service";
import type { ProfileResponseDto } from "@/features/auth/types/auth.types";
import type { Permission } from "@/types/enums";

export function useGrantPermission() {
  return useApiMutation<ProfileResponseDto, { userId: string; permission: Permission }>({
    mutationFn: ({ userId, permission }) => userPermissionsService.grant(userId, permission),
  });
}
