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

    status: StudentStatus;

    joinedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
