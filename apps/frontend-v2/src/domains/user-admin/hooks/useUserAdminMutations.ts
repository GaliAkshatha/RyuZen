import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { userAdminService } from "@/domains/user-admin/userAdminService";
import type { UpdateUserStatusRequest, PermissionRequest } from "@/domains/user-admin/userAdmin.types";
import type { ProfileResponse } from "@/domains/auth/auth.types";

/**
 * Real fix caught before shipping: useFacultyMember/useStudent cache
 * their query under ["faculty", facultyRecordId] / ["students",
 * studentRecordId] - the FACULTY/STUDENT record id, not the userId
 * these /users/:userId/... endpoints actually operate on. Those are
 * two different values. Invalidating with userId would have silently
 * done nothing. Each hook here takes the userId separately (for the
 * real API call) from recordQueryKey (the caller's own already-
 * correct cache key, e.g. ["faculty", id] from useFacultyMember) -
 * the caller passes both because it's the only place that genuinely
 * has both values in scope.
 */
export function useGrantPermission(userId: string, recordQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return useApiMutation<ProfileResponse, PermissionRequest>({
    mutationFn: (payload) => userAdminService.grantPermission(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recordQueryKey }),
  });
}

export function useRevokePermission(userId: string, recordQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return useApiMutation<ProfileResponse, PermissionRequest>({
    mutationFn: (payload) => userAdminService.revokePermission(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recordQueryKey }),
  });
}

export function useUnlockUser(userId: string, recordQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return useApiMutation<ProfileResponse, void>({
    mutationFn: () => userAdminService.unlockUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recordQueryKey }),
  });
}

export function useUpdateUserStatus(userId: string, recordQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return useApiMutation<ProfileResponse, UpdateUserStatusRequest>({
    mutationFn: (payload) => userAdminService.updateStatus(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recordQueryKey }),
  });
}
