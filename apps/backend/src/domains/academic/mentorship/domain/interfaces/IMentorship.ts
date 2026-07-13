import { MentorshipStatus } from "../constants/MentorshipStatus.js";

export interface IMentorship {

    id?: string;

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
