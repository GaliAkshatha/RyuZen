import { User } from "../../domain/entities/User.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";
import { UserRole } from "../../domain/constants/UserRole.js";

export interface IUserRepository {

    create(user: User): Promise<User>;

    findById(id: string, options?: {
        includePassword?: boolean;
    }): Promise<User | null>;

    findByEmail(email: string,options?:{
        includePassword?: boolean;
    }) : Promise<User | null>;

    existsByEmail(email: string): Promise<boolean>;

    findByOrganization(
        organizationId: string
    ): Promise<User[]>;

    save(user: User): Promise<User>;

    updateLastLogin(
        userId: string
    ): Promise<void>;

    /** Returns the new count after incrementing, so the caller can compare against env.ACCOUNT_LOCK_THRESHOLD without a separate read. */
    incrementFailedAttempts(
        userId: string
    ): Promise<number>;

    /** Also clears lockedUntil - a successful login (or an admin unlock) means the account is no longer a live brute-force target. */
    resetFailedAttempts(
        userId: string
    ): Promise<void>;

    lockAccount(
        userId: string,
        lockedUntil: Date
    ): Promise<void>;

    updateStatus(
        userId: string,
        status: UserStatus
    ): Promise<void>;

    /** A real, administrative role change - e.g. converting a placed student to an alumnus. Never used for self-service role changes. */
    updateRole(
        userId: string,
        role: UserRole
    ): Promise<void>;

    updatePassword(
        userId: string,
        passwordHash: string
    ): Promise<void>;

    setPasswordResetToken(
        userId: string,
        tokenHash: string,
        expiresAt: Date
    ): Promise<void>;

    clearPasswordResetToken(
        userId: string
    ): Promise<void>;

}