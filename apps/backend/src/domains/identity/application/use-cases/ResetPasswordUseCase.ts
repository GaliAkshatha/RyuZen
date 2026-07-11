import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { ResetPasswordDto } from "../dto/ResetPasswordDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class ResetPasswordUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: ResetPasswordDto

    ): Promise<void> {

        const user =

            await this.userRepository.findByEmail(
                dto.email
            );

        if (

            !user ||
            !user.passwordReset?.tokenHash ||
            !user.passwordReset?.expiresAt ||
            user.passwordReset.expiresAt.getTime() < Date.now()

        ) {

            throw new ApiError(

                "Invalid or expired reset token.",

                HttpStatus.BAD_REQUEST

            );

        }

        const valid =

            await this.passwordHasher.compare(

                dto.token,

                user.passwordReset.tokenHash

            );

        if (!valid) {

            throw new ApiError(

                "Invalid or expired reset token.",

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

        await this.userRepository.clearPasswordResetToken(

            user.id!

        );

    }

}
