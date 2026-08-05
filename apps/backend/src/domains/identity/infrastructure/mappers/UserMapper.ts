import { IUser } from "../../domain/interfaces/IUser.js";
import { User } from "../../domain/entities/User.js";

import { UserDocument } from "../persistence/UserModel.js";

export class UserMapper {

    static toDomain(
        document: UserDocument
    ): User {

        return new User({

            id: document.id,

            organizationId: document.organizationId.toString(),

            name: document.name,

            email: document.email,

            role: document.role,

            permissions: [...(document.permissions ?? [])],

            status: document.status,

            profile: {

                image: document.profile.image,

                phone: document.profile.phone,

                bio: document.profile.bio,

            },

            auth: {

                passwordHash: document.auth.passwordHash,

                emailVerified: document.auth.emailVerified,

                lastLogin: document.auth.lastLogin,

                failedAttempts: document.auth.failedAttempts,

                lockedUntil: document.auth.lockedUntil,

            },

            passwordReset: document.passwordReset

                ? {

                    tokenHash: document.passwordReset.tokenHash,

                    expiresAt: document.passwordReset.expiresAt,

                }

                : undefined,

            joinedAt: document.joinedAt,

            graduationYear: document.graduationYear,

            studentId: document.studentId,

            employeeId: document.employeeId,

            createdAt: document.createdAt,

            updatedAt: document.updatedAt,

        });

    }

    static toPersistence(user: User ): IUser {
        
        return {
            ...user.toObject (),
            permissions: [...user.permissions]
        };
    }

}
