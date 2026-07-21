/** Mirrors CertificateResponseDto exactly. Immutable once issued — no update/delete endpoint exists. */
export interface CertificateResponseDto {
  id: string;
  studentId: string;
  eventId?: string;
  activityId?: string;
  certificateUrl: string;
  issuedAt: string;
}

/**
 * Mirrors IssueCertificateDto exactly. This is a distinct, more general
 * issuance path from C3's Events-specific bulk-issue
 * (POST /events/:id/certificates) — this one takes a manually-provided
 * certificateUrl (the actual file/PDF is generated or hosted
 * elsewhere), optionally linked to an event OR activity, or neither.
 */
export interface IssueCertificatePayload {
  studentId: string;
  eventId?: string;
  activityId?: string;
  certificateUrl: string;
}
