import { UserRole } from "@/types/enums";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

/** Mirrors InvitationResponseDto exactly. */
export interface InvitationResponseDto {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt?: string;
  acceptedAt?: string;
}

/** Mirrors InviteUserDto — only Faculty/Student/Alumni/Placement Admin are invitable, enforced on the backend even if this type is widened. */
export interface InviteUserPayload {
  name: string;
  email: string;
  role: UserRole;
}
