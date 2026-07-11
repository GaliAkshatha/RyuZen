import { IUserRepository } from "./IUserRepository.js";

import { User } from "../../domain/entities/User.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";

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
        id: string
    ): Promise<User | null> {

        const document =
            await UserModel.findById(id);

        if (!document) {

            return null;

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
    ): Promise<void> {

        await UserModel.updateOne(

            {
                _id: userId,
            },

            {
                $inc: {
                    "auth.failedAttempts": 1,
                },
            }

        );

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

}