import { AlumniStatus } from "../../domain/constants/AlumniStatus.js";

export interface AlumniResponseDto {

    id: string;

    organizationId: string;

    userId?: string;

    email: string;

    name?: string;

    graduationYear?: number;

    company?: string;

    designation?: string;

    isVerified: boolean;

    status: AlumniStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
