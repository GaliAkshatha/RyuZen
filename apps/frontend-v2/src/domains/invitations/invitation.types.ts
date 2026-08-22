/** Matches the real backend InvitationResponseDto exactly. */
export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;
export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];

export interface Invitation {
  id: string;
  userId: string;
  email: string;
  role: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt?: string;
  acceptedAt?: string;
}

/**
 * Matches InviteUserSchema exactly - role is genuinely restricted to
 * these 4 values by the real Zod enum (confirmed directly). RECRUITER
 * is deliberately absent - recruiters are created via the separate
 * POST /recruiters flow (creates the account and Recruiter profile
 * together), not this generic invitation.
 */
export interface InviteUserRequest {
  name: string;
  email: string;
  role: "PLACEMENT_ADMIN" | "FACULTY" | "STUDENT" | "ALUMNI";
}
