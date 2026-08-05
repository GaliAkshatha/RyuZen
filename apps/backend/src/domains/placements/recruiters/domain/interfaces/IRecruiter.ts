import { RecruiterStatus } from "../constants/RecruiterStatus.js";

/**
 * Links a real, already-invited User (created via the centralized
 * Invitation System - see InviteUserUseCase's PLACEMENT_ADMIN
 * restriction) to a real Company. A recruiter is scoped to exactly
 * one company - never organization-wide, matching "Recruiters
 * primarily interact with eligible applicants for their own drives,
 * not an unrestricted student directory."
 */
export interface IRecruiter {

    id?: string;

    organizationId: string;

    userId: string;

    companyId: string;

    jobTitle?: string;

    status: RecruiterStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
