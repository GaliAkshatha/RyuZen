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

    resume?: string;

    status: JobApplicationStatus;

    remarks?: string;

    appliedAt: Date;

}
