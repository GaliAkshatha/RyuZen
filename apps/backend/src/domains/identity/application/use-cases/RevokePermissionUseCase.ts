import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { RevokePermissionDto } from "../dto/RevokePermissionDto.js";
import { ProfileResponseDto } from "../dto/ProfileResponseDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class RevokePermissionUseCase {

    constructor(

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string,

        dto: RevokePermissionDto

    ): Promise<ProfileResponseDto> {

        const user =

            await this.userRepository.findById(
                userId
            );

        if (!user) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        user.revokePermission(dto.permission);

        const updated =

            await this.userRepository.save(
                user
            );

        return {

            id: updated.id!,

            organizationId: updated.organizationId,

            name: updated.name,

            email: updated.email,

            role: updated.role,

            status: updated.status,

            permissions: [...updated.permissions],

            profile: {

                image: updated.profile.image,

                phone: updated.profile.phone,

                bio: updated.profile.bio

            },

            createdAt: updated.createdAt,

            updatedAt: updated.updatedAt

        };

    }

}