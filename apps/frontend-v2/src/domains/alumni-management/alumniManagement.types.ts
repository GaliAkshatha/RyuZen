/** Matches the real backend AlumniResponseDto exactly. */
export const AlumniStatus = { INVITED: "INVITED", ACTIVE: "ACTIVE" } as const;
export type AlumniStatus = (typeof AlumniStatus)[keyof typeof AlumniStatus];

export interface AlumniRecord {
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

/** Matches CreateAlumniSchema exactly - links an ALREADY-EXISTING user account, same real pattern as Faculty/Student. */
export interface CreateAlumniRequest {
  userId: string;
  graduationYear?: number;
  company?: string;
  designation?: string;
}

/** Matches InviteAlumniSchema exactly - a genuinely SEPARATE path from CreateAlumniRequest: creates an alumni record with NO user account yet, triggers a real invite-token flow (confirmed: IAlumni has inviteTokenHash/inviteExpiresAt fields for exactly this). */
export interface InviteAlumniRequest {
  email: string;
  name?: string;
  graduationYear?: number;
}

/** Matches UpdateAlumniSchema exactly. */
export interface UpdateAlumniRequest {
  name?: string;
  graduationYear?: number;
  company?: string;
  designation?: string;
}

/** Matches ConvertStudentToAlumniSchema exactly. */
export interface ConvertStudentToAlumniRequest {
  graduationYear?: number;
  company?: string;
  designation?: string;
}
