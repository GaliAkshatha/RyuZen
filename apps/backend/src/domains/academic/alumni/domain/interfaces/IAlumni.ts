import { AlumniStatus } from "../constants/AlumniStatus.js";

export interface IAlumni {

    id?: string;

    organizationId: string;

    userId?: string;

    email: string;

    name?: string;

    graduationYear?: number;

    company?: string;

    designation?: string;

    isVerified: boolean;

    status: AlumniStatus;

    inviteTokenHash?: string;

    inviteExpiresAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
