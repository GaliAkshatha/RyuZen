import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

export interface JobApplicationResponseDto {

    id: string;

    placementId: string;

    studentId: string;

    /** Enriched server-side (GetJobApplicationsForPlacementUseCase) -
     * real gap found: reviewers had no way to resolve who an
     * application actually belonged to. Placement Admin in particular
     * cannot call GET /students/:id at all (confirmed admin-only), so
     * this can't be resolved client-side the way Org Admin might
     * otherwise attempt. */
    studentName?: string;

    studentUsn?: string;

    /** Enriched alongside studentName/studentUsn - closes a real gap: the recruiter-facing Career Score/Resume/AI Interview candidate routes all take the student's real USER id, not this application's studentId (a different, Student-document id, confirmed against the entities that create each) - without this field there was no way to call any of them from an application record at all. */
    studentUserId?: string;

    resume?: string;

    status: JobApplicationStatus;

    remarks?: string;

    appliedAt: Date;

}
