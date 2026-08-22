import type { UserRole, UserStatus } from "@/shared/types/enums";

/** Confirmed directly against LoginDto.ts */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Confirmed directly against AuthResponseDto.ts - real fields only. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    organizationId: string;
    name: string;
    email: string;
    role: string;
  };
}

/** Confirmed directly against RefreshTokenSchema/RefreshTokenUseCase - body-delivered, not a cookie. */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Confirmed directly against ProfileResponseDto.ts */
export interface ProfileResponse {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  profile: {
    image: string;
    phone: string;
    bio: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
