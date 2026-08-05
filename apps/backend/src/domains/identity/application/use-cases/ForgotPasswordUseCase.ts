import { randomBytes } from "crypto";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { ForgotPasswordDto } from "../dto/ForgotPasswordDto.js";
import { ForgotPasswordResponseDto } from "../dto/ForgotPasswordResponseDto.js";

import { IEmailService } from "../../../../shared/infrastructure/email/IEmailService.js";
import { buildPasswordResetEmail } from "../../../../shared/infrastructure/email/emailTemplates.js";
import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";
import { env } from "../../../../config/env.js";

/**
 * SECURITY FIX: this previously returned the raw resetToken directly
 * in the API response body (see the TODO that used to be here — "no
 * email delivery infrastructure exists yet"). That meant ANY caller
 * could obtain a valid password-reset token for ANY email address
 * just by calling this endpoint, with no access to that person's
 * inbox required at all — a real account-takeover path, not a
 * theoretical one. Now that IEmailService exists, the token is only
 * ever emailed to the account's own address; the API response never
 * contains it.
 *
 * The token itself is hashed with hashToken (SHA-256), not bcrypt -
 * bcrypt silently truncates input to 72 bytes, which is fine for
 * short human passwords but the wrong tool for a token (see
 * hashToken.ts). This 64-byte token was never actually vulnerable to
 * the truncation bug itself, but using the same correct tool
 * everywhere tokens are hashed removes the whole risk class rather
 * than relying on every token happening to stay under 72 bytes.
 */
export class ForgotPasswordUseCase {

    private readonly TOKEN_TTL_MS = 60 * 60 * 1000;

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly emailService: IEmailService

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

            hashToken(
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

        const resetUrl =
            `${env.FRONTEND_URL}/auth/reset-password?email=${encodeURIComponent(user.email)}&token=${resetToken}`;

        const { subject, html } = buildPasswordResetEmail(resetUrl);

        await this.emailService.send({

            to: user.email,

            subject,

            html

        });

        return {};

    }

}
