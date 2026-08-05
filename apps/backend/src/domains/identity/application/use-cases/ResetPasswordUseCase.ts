import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { ResetPasswordDto } from "../dto/ResetPasswordDto.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { CreateAuditLogUseCase } from "../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * The reset TOKEN is compared with hashToken (SHA-256) - bcrypt is the
 * wrong tool for a high-entropy token (see hashToken.ts), reused here
 * for consistency with ForgotPasswordUseCase, which generates it.
 * passwordHasher is still used below for what it's actually meant
 * for: hashing the real new password the user is setting.
 */
export class ResetPasswordUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly createAuditLog: CreateAuditLogUseCase,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

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

            hashToken(dto.token) === user.passwordReset.tokenHash;

        if (!valid) {

            throw new ApiError(

                "Invalid or expired reset token.",

                HttpStatus.BAD_REQUEST

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

        await this.userRepository.clearPasswordResetToken(

            user.id!

        );

        await this.createAuditLog.execute({

            organizationId: user.organizationId,

            userId: user.id,

            action: "PASSWORD_RESET",

            entityType: "User",

            entityId: user.id,

            method: "POST",

            path: "/api/v1/auth/reset-password",

            statusCode: 200,

        }).catch(() => {
            // Audit logging must never break a real password reset.
        });

    }

}
