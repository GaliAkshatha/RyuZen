import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { CreateAuditLogUseCase } from "../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { UserStatus } from "../../domain/constants/UserStatus.js";

import { AcceptInvitationDto } from "../dto/AcceptInvitationDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

const INVALID_MESSAGE = "This invitation link is invalid or has expired.";

/**
 * The final step: Invitation -> Email Verification -> Password
 * Creation -> Account Active. Re-verifies the token from scratch
 * (defense in depth - never trusts that VerifyInvitationUseCase was
 * genuinely called first, even though the frontend flow always calls
 * it first) before setting the password and activating the account.
 */
export class AcceptInvitationUseCase {

    constructor(

        private readonly invitationRepository: IInvitationRepository,

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly createAuditLog: CreateAuditLogUseCase,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

    ) {}

    async execute(

        dto: AcceptInvitationDto

    ): Promise<void> {

        const invitation =

            await this.invitationRepository.findPendingByEmail(
                dto.email
            );

        if (!invitation || invitation.isExpired()) {

            throw new ApiError(

                INVALID_MESSAGE,

                HttpStatus.BAD_REQUEST

            );

        }

        const tokenValid =

            hashToken(dto.token) === invitation.tokenHash;

        if (!tokenValid) {

            throw new ApiError(

                INVALID_MESSAGE,

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await this.userRepository.findById(
                invitation.userId
            );

        if (!user) {

            throw new ApiError(

                INVALID_MESSAGE,

                HttpStatus.BAD_REQUEST

            );

        }

        const orgSettings =

            await this.organizationSettingsRepository.findByOrganizationId(
                invitation.organizationId
            );

        const minLength = orgSettings?.security.passwordMinLength;

        if (minLength && dto.password.length < minLength) {

            throw new ApiError(

                `This organization requires passwords to be at least ${minLength} characters.`,

                HttpStatus.BAD_REQUEST

            );

        }

        const passwordHash =

            await this.passwordHasher.hash(
                dto.password
            );

        await this.userRepository.updatePassword(

            user.id!,

            passwordHash

        );

        await this.userRepository.updateStatus(

            user.id!,

            UserStatus.ACTIVE

        );

        invitation.accept();

        await this.invitationRepository.save(
            invitation
        );

        await this.createAuditLog.execute({

            organizationId: invitation.organizationId,

            userId: user.id,

            action: "INVITATION_ACCEPTED",

            entityType: "User",

            entityId: user.id,

            method: "POST",

            path: "/api/v1/auth/accept-invitation",

            statusCode: 200,

        }).catch(() => {
            // Audit logging must never break real account activation.
        });

    }

}
