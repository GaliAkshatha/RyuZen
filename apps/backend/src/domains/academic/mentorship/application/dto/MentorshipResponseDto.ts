import { MentorshipStatus } from "../../domain/constants/MentorshipStatus.js";

export interface MentorshipResponseDto {

    id: string;

    organizationId: string;

    facultyId: string;

    studentId: string;

    /** Enriched server-side (GetMentorshipsUseCase) - Faculty cannot
     * call GET /students (admin-only, confirmed), so without this the
     * "My Students" roster could only ever show a raw student id.
     * Same real gap and same fix already applied to
     * GetLeaderboardUseCase. */
    studentName?: string;

    studentUsn?: string;

    assignedBy: string;

    assignedDate: Date;

    status: MentorshipStatus;

    remarks?: string;

    createdAt?: Date;

    updatedAt?: Date;

}
