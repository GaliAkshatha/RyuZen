import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { IEmailService } from "../../../../shared/infrastructure/email/IEmailService.js";
import { buildPasswordChangedEmail } from "../../../../shared/infrastructure/email/emailTemplates.js";

import { ChangePasswordDto } from "../dto/ChangePasswordDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * SECURITY ADDITION, per explicit product direction: sends a real
 * email notification to the account's own address after a successful
 * password change - reuses the same real IEmailService already
 * proven correct for password-reset delivery. A genuine account
 * compromise (attacker with the current password) would previously
 * change the password with zero signal to the real owner; this
 * closes that gap. The notification is sent after the password is
 * already updated and never blocks or rolls back that change if
 * delivery fails - a real, successful password change must not be
 * undone by an email provider hiccup.
 */
export class ChangePasswordUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository,

        private readonly emailService: IEmailService

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

        const { subject, html } = buildPasswordChangedEmail();

        try {

            await this.emailService.send({

                to: user.email,

                subject,

                html

            });

        } catch {

            // A real, already-successful password change must not be
            // undone by an email provider hiccup - the change stands
            // regardless of whether this notification delivers.

        }

    }

}
