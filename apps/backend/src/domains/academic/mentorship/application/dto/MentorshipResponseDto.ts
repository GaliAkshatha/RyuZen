import { MentorshipStatus } from "../../domain/constants/MentorshipStatus.js";

export interface MentorshipResponseDto {

    id: string;

    organizationId: string;

    facultyId: string;

    studentId: string;

    assignedBy: string;

    assignedDate: Date;

    status: MentorshipStatus;

    remarks?: string;

    createdAt?: Date;

    updatedAt?: Date;

}
