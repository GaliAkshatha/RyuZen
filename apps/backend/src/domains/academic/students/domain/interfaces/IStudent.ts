import { StudentStatus } from "../constants/StudentStatus.js";

export interface IStudent {

    id?: string;

    organizationId: string;

    userId: string;

    departmentId?: string;

    mentorId?: string;

    usn: string;

    batch: string;

    semester: number;

    cgpa?: number;

    /** All below are new, added for bulk import - CreateStudentUseCase and the manual student-creation flow leave them undefined, they're optional everywhere. */
    section?: string;

    admissionYear?: number;

    graduationYear?: number;

    tenthPercentage?: number;

    twelfthPercentage?: number;

    entranceRank?: number;

    status: StudentStatus;

    joinedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
