/** Matches the real backend CompanyResponseDto exactly. */
export interface Company {
  id: string;
  organizationId: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches CreateCompanySchema exactly - real URL/email validation confirmed on logo/website/hrEmail. */
export interface CreateCompanyRequest {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
}
