import { UserRole } from "../constants/UserRole.js";
import { UserStatus } from "../constants/UserStatus.js";
import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export interface IUser {

    id?: string;

    organizationId: string;

    name: string;

    email: string;

    role: UserRole;

    permissions: Permission[];
    
    status: UserStatus;

    joinedAt?: Date;

    graduationYear?: number;

    studentId?: string;

    employeeId?: string;

    profile: {

        image: string;

        phone: string;

        bio: string;

    };

    auth: {

        passwordHash: string;

        emailVerified: boolean;

        lastLogin?: Date;

        failedAttempts: number;

    };

    createdAt?: Date;

    updatedAt?: Date;

}