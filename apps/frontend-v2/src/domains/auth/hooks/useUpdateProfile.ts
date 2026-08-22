import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ProfileResponse } from "@/domains/auth/auth.types";

export interface UpdateProfileRequest {
  name?: string;
  profile?: { image?: string; phone?: string; bio?: string };
}

export function useUpdateProfile() {
  return useApiMutation<ProfileResponse, UpdateProfileRequest>({
    mutationFn: async (payload) => {
      const res = await apiClient.patch<ApiSuccessResponse<ProfileResponse>>("/auth/profile", payload);
      return res.data.data;
    },
  });
}
