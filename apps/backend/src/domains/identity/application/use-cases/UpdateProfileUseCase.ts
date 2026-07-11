import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { UpdateProfileDto } from "../dto/UpdateProfileDto.js";
import { ProfileResponseDto } from "../dto/ProfileResponseDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class UpdateProfileUseCase {

    constructor(

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string,

        dto: UpdateProfileDto

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

        user.updateProfile(dto);

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
