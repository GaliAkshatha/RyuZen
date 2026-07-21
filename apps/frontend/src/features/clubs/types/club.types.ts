import { ClubMemberRole, ClubMemberStatus, ClubStatus } from "@/types/enums";

/**
 * Mirrors ClubResponseDto exactly. `presidentStudentId`/
 * `vicePresidentStudentId` are derived fields — likely computed from
 * the member list's role assignments, not separately settable.
 */
export interface ClubResponseDto {
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

/**
 * Mirrors ClubMemberResponseDto exactly. `studentId` references
 * Student.id (not userId) — same convention as AssignMentorDto (A2).
 */
export interface ClubMemberResponseDto {
  id: string;
  clubId: string;
  studentId: string;
  role: ClubMemberRole;
  joinedAt: string;
  status: ClubMemberStatus;
}

/** Mirrors CreateClubDto */
export interface CreateClubPayload {
  name: string;
  code: string;
  description?: string;
  logo?: string;
  facultyAdvisorId?: string;
}

/** Mirrors UpdateClubDto — no "code" field, matching Department's same convention (A1) */
export interface UpdateClubPayload {
  name?: string;
  description?: string;
  logo?: string;
}

/** Mirrors AssignAdvisorDto */
export interface AssignAdvisorPayload {
  facultyId: string;
}

/**
 * Mirrors AddClubMemberDto. This is genuinely how membership works on
 * this backend — an admin adds a student, confirmed this milestone by
 * grepping club.routes.ts: POST /:id/members is SUPER_ADMIN + ORG_ADMIN
 * ONLY. There is no self-service "Join" endpoint anywhere on this
 * router; the roadmap's "Browse, Join, Manage" framing for this
 * milestone is corrected to "Browse, Manage" — see ClubDetailPage.tsx.
 */
export interface AddClubMemberPayload {
  studentId: string;
  role?: ClubMemberRole;
}
