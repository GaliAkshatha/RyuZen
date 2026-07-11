import { User } from "../../domain/entities/User.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";

export interface IUserRepository {

    create(user: User): Promise<User>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string,options?:{
        includePassword?: boolean;
    }) : Promise<User | null>;

    existsByEmail(email: string): Promise<boolean>;

    findByOrganization(
        organizationId: string
    ): Promise<User[]>;

    updateLastLogin(
        userId: string
    ): Promise<void>;

    incrementFailedAttempts(
        userId: string
    ): Promise<void>;

    resetFailedAttempts(
        userId: string
    ): Promise<void>;

    updateStatus(
        userId: string,
        status: UserStatus
    ): Promise<void>;

}