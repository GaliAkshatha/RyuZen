import { AlumniStatus } from "@/types/enums";

/**
 * Mirrors AlumniResponseDto exactly. Note there are TWO separate status
 * concepts on this entity: `status` (INVITED | ACTIVE — has the invited
 * person completed registration?) and `isVerified` (has an admin
 * confirmed this is a real alumnus? — a separate boolean, set by the
 * Verify action). Both are shown distinctly in the UI, not conflated.
 */
export interface AlumniResponseDto {
  id: string;
  organizationId: string;
  userId?: string;
  email: string;
  name?: string;
  graduationYear?: number;
  company?: string;
  designation?: string;
  isVerified: boolean;
  status: AlumniStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mirrors CreateAlumniDto — attaches an Alumni record to an EXISTING
 * registered user. Distinct from Invite (below), which is for someone
 * who doesn't have an account yet. The roadmap's page list only names
 * "Invite Alumni" (not a separate "Create Alumni" page), so this method
 * exists on the service for API-surface completeness but has no
 * dedicated UI in this milestone — see alumni.service.ts.
 */
export interface CreateAlumniPayload {
  userId: string;
  graduationYear?: number;
  company?: string;
  designation?: string;
}

/** Mirrors UpdateAlumniDto */
export interface UpdateAlumniPayload {
  name?: string;
  graduationYear?: number;
  company?: string;
  designation?: string;
}

/** Mirrors InviteAlumniDto */
export interface InviteAlumniPayload {
  email: string;
  name?: string;
  graduationYear?: number;
}

/**
 * Mirrors InviteAlumniResponseDto exactly. `inviteToken` is returned
 * directly in the response for the same reason as P1's forgot-password
 * flow — no email delivery infrastructure exists yet (confirmed by the
 * backend's own InviteAlumniUseCase, which generates the token and
 * returns it with no email-send step). The UI must present it as a
 * temporary development convenience, not as if it were emailed.
 */
export interface InviteAlumniResponseDto {
  id: string;
  email: string;
  inviteToken: string;
}
