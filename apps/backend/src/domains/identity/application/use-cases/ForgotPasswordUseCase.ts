import { randomBytes } from "crypto";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { ForgotPasswordDto } from "../dto/ForgotPasswordDto.js";
import { ForgotPasswordResponseDto } from "../dto/ForgotPasswordResponseDto.js";

export class ForgotPasswordUseCase {

    private readonly TOKEN_TTL_MS = 60 * 60 * 1000;

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: ForgotPasswordDto

    ): Promise<ForgotPasswordResponseDto> {

        const user =

            await this.userRepository.findByEmail(
                dto.email
            );

        if (!user) {

            // Do not reveal whether the account exists.
            return {};

        }

        const resetToken =

            randomBytes(32).toString("hex");

        const tokenHash =

            await this.passwordHasher.hash(
                resetToken
            );

        const expiresAt =

            new Date(
                Date.now() + this.TOKEN_TTL_MS
            );

        await this.userRepository.setPasswordResetToken(

            user.id!,

            tokenHash,

            expiresAt

        );

        // TODO: deliver via the Notifications/Email module once available.
        // Returned directly for now since no email delivery infrastructure exists yet.
        return {

            resetToken

        };

    }

}
