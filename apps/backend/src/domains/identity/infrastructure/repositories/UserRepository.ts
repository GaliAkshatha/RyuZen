import { IUserRepository } from "./IUserRepository.js";

import { User } from "../../domain/entities/User.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";
import { UserRole } from "../../domain/constants/UserRole.js";

import { UserModel } from "../persistence/UserModel.js";
import { UserMapper } from "../mappers/UserMapper.js";

export class UserRepository
implements IUserRepository {

    async create(user: User): Promise<User> {

        const document =
            await UserModel.create(
                UserMapper.toPersistence(user)
            );

        return UserMapper.toDomain(document);

    }

    async findById(
        id: string,
        options?: {
            includePassword?: boolean;
        }
    ): Promise<User | null> {

        const query =
            UserModel.findById(id);

        if (options?.includePassword) {

            query.select("+auth.passwordHash");

        }

        const document =
            await query;

        if (!document) {

            return null;

        }

        return UserMapper.toDomain(document);

    }

    async save(
        user: User
    ): Promise<User> {

        const document =
            await UserModel.findByIdAndUpdate(

                user.id,

                UserMapper.toPersistence(user),

                {
                    new: true,
                    runValidators: true,
                }

            );

        if (!document) {

            throw new Error(
                "User not found."
            );

        }

        return UserMapper.toDomain(document);

    }

    async findByEmail(
        email: string
    ): Promise<User | null> {

        const document =
            await UserModel
                .findOne({ email })
                .select("+auth.passwordHash");

        if (!document) {

            return null;

        }

        return UserMapper.toDomain(document);

    }

    async existsByEmail(
        email: string
    ): Promise<boolean> {

        return await UserModel.exists({
            email,
        }) !== null;

    }

    async findByOrganization(
        organizationId: string
    ): Promise<User[]> {

        const documents =
            await UserModel.find({
                organizationId,
            });

        return documents.map(
            UserMapper.toDomain
        );

    }

    async updateLastLogin(
        userId: string
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    "auth.lastLogin": new Date(),
                },
            }

        );

    }

    async incrementFailedAttempts(

        userId: string

    ): Promise<number> {

        const document =

            await UserModel.findOneAndUpdate(

                {
                    _id: userId,
                },

                {
                    $inc: {
                        "auth.failedAttempts": 1,
                    },
                },

                {
                    new: true,
                }

            );

        return document?.auth.failedAttempts ?? 0;

    }

    async resetFailedAttempts(
        userId: string
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    "auth.failedAttempts": 0,
                },
                $unset: {
                    "auth.lockedUntil": "",
                },
            }

        );

    }

    async lockAccount(

        userId: string,

        lockedUntil: Date

    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    "auth.lockedUntil": lockedUntil,
                },
            }

        );

    }

    async updateStatus(
        userId: string,
        status: UserStatus
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    status,
                },
            }

        );

    }

    async updateRole(
        userId: string,
        role: UserRole
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    role,
                },
            }

        );

    }

    async updatePassword(
        userId: string,
        passwordHash: string
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    "auth.passwordHash": passwordHash,
                },
            }

        );

    }

    async setPasswordResetToken(
        userId: string,
        tokenHash: string,
        expiresAt: Date
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $set: {
                    "passwordReset.tokenHash": tokenHash,
                    "passwordReset.expiresAt": expiresAt,
                },
            }

        );

    }

    async clearPasswordResetToken(
        userId: string
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $unset: {
                    passwordReset: "",
                },
            }

        );

    }

}