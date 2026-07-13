import { StudentStatus } from "../../domain/constants/StudentStatus.js";

export interface StudentResponseDto {

    id: string;

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
