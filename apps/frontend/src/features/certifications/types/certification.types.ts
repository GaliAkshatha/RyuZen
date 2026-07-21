/**
 * Mirrors CertificationResponseDto exactly. Same pattern as Skills
 * (CE1), Education (CE2), Experience (CE3): `userId` is the owning
 * User.id directly, Create/List/Get/Update/Delete have NO role
 * restriction on the backend at all, and Update/Delete enforce real
 * per-record ownership server-side ("You can only update your own
 * certifications.", 403) — confirmed this milestone. No Verify action
 * exists here either. `skills` is a free-text string array, same
 * convention as Experience.
 */
export interface CertificationResponseDto {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  credentialId?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateCertificationDto */
export interface CreateCertificationPayload {
  title: string;
  issuer: string;
  credentialId?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  skills?: string[];
}

/** Mirrors UpdateCertificationDto — every field optional */
export interface UpdateCertificationPayload {
  title?: string;
  issuer?: string;
  credentialId?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  skills?: string[];
}
