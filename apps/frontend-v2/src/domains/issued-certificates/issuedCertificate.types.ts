/**
 * Matches the real backend CertificateResponseDto exactly. Deliberately
 * a separate domain from the student-reported "certifications"
 * feature (career/certifications) - this represents a platform-issued
 * certificate (Faculty/Org Admin issuing recognition for a real
 * activity/event), a genuinely different concern with its own real
 * backend domain (campus/certificates) confirmed directly.
 */
export interface IssuedCertificate {
  id: string;
  studentId: string;
  eventId?: string;
  activityId?: string;
  certificateUrl: string;
  issuedAt: string;
}

/** Matches IssueCertificateSchema exactly - certificateUrl is a real link the issuer already has, not a file this endpoint generates. */
export interface IssueCertificateRequest {
  studentId: string;
  eventId?: string;
  activityId?: string;
  certificateUrl: string;
}
