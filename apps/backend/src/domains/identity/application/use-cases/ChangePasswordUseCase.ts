import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { ChangePasswordDto } from "../dto/ChangePasswordDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class ChangePasswordUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

    ) {}

    async execute(

        userId: string,

        dto: ChangePasswordDto

    ): Promise<void> {

        const user =

            await this.userRepository.findById(

                userId,

                {
                    includePassword: true
                }

            );

        if (!user) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const valid =

            await this.passwordHasher.compare(

                dto.currentPassword,

                user.auth.passwordHash

            );

        if (!valid) {

            throw new ApiError(

                "Current password is incorrect.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const orgSettings =

            await this.organizationSettingsRepository.findByOrganizationId(
                user.organizationId
            );

        const minLength = orgSettings?.security.passwordMinLength;

        if (minLength && dto.newPassword.length < minLength) {

            throw new ApiError(

                `This organization requires passwords to be at least ${minLength} characters.`,

                HttpStatus.BAD_REQUEST

            );

        }

        const passwordHash =

            await this.passwordHasher.hash(
                dto.newPassword
            );

        await this.userRepository.updatePassword(

            user.id!,

            passwordHash

        );

    }

}
