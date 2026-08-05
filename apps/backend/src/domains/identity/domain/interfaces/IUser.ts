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

        /** Set once failedAttempts reaches env.ACCOUNT_LOCK_THRESHOLD; login is denied while this is in the future. Cleared on a successful login or an admin unlock. */
        lockedUntil?: Date;

    };

    passwordReset?: {

        tokenHash?: string;

        expiresAt?: Date;

    };

    createdAt?: Date;

    updatedAt?: Date;

}