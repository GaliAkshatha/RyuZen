export const ClubStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
export type ClubStatus = (typeof ClubStatus)[keyof typeof ClubStatus];

export const ClubMemberRole = { MEMBER: "MEMBER", PRESIDENT: "PRESIDENT", VICE_PRESIDENT: "VICE_PRESIDENT" } as const;
export type ClubMemberRole = (typeof ClubMemberRole)[keyof typeof ClubMemberRole];

/** Matches the real backend ClubResponseDto exactly. Create/Update/Delete/AssignAdvisor/AddMember/RemoveMember are all SUPER_ADMIN/ORG_ADMIN only - real, confirmed admin-managed membership, not students self-joining. */
export interface Club {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  logo?: string;
  facultyAdvisorId?: string;
  presidentStudentId?: string;
  vicePresidentStudentId?: string;
  status: ClubStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches the real backend ClubMemberResponseDto exactly. */
export interface ClubMember {
  id: string;
  clubId: string;
  studentId: string;
  role: ClubMemberRole;
  joinedAt: string;
  status: string;
}

/** Matches CreateClubSchema exactly. */
export interface CreateClubRequest {
  name: string;
  code: string;
  description?: string;
  logo?: string;
  facultyAdvisorId?: string;
}

/** Matches UpdateClubSchema exactly. */
export interface UpdateClubRequest {
  name?: string;
  description?: string;
  logo?: string;
}

/** Matches AssignAdvisorSchema exactly. */
export interface AssignAdvisorRequest {
  facultyId: string;
}

/** Matches AddClubMemberSchema exactly. */
export interface AddClubMemberRequest {
  studentId: string;
  role?: ClubMemberRole;
}
