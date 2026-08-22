import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { AuthResponse, LoginRequest, ProfileResponse } from "@/domains/auth/auth.types";

/** Every call here maps 1:1 to a real, confirmed backend route (auth.routes.ts). */
export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/login", payload);
    return response.data.data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ApiSuccessResponse<ProfileResponse>>("/auth/profile");
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
