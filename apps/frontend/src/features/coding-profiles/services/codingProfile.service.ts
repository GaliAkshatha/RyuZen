import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CodingProfileResponseDto,
  LinkCodingProfilePayload,
} from "@/features/coding-profiles/types/codingProfile.types";

export const codingProfileService = {
  getMyProfiles(): Promise<CodingProfileResponseDto[]> {
    return apiClient
      .get<CodingProfileResponseDto[]>(`${API_ENDPOINTS.codingProfiles}/me`)
      .then((response) => response.data);
  },

  /** Real, server-side verification against the live platform API happens here — a fabricated or mistyped handle is genuinely rejected, not silently accepted. */
  link(payload: LinkCodingProfilePayload): Promise<CodingProfileResponseDto> {
    return apiClient
      .post<CodingProfileResponseDto>(API_ENDPOINTS.codingProfiles, payload)
      .then((response) => response.data);
  },

  sync(profileId: string): Promise<CodingProfileResponseDto> {
    return apiClient
      .post<CodingProfileResponseDto>(`${API_ENDPOINTS.codingProfiles}/${profileId}/sync`, {})
      .then((response) => response.data);
  },
};
