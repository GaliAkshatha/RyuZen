/** Matches the real backend RecruiterResponseDto exactly. */
export interface RecruiterProfile {
  id: string;
  organizationId: string;
  userId: string;
  companyId: string;
  jobTitle?: string;
  status: string;
  createdAt?: string;
}
