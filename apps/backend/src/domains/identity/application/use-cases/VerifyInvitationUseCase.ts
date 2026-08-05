import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import {
    IOrganizationRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationRepository.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { CreateAuditLogUseCase } from "../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import { UserStatus } from "../../domain/constants/UserStatus.js";

import { VerifyInvitationDto } from "../dto/VerifyInvitationDto.js";
import { VerifyInvitationResponseDto } from "../dto/VerifyInvitationResponseDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

const INVALID_MESSAGE = "This invitation link is invalid or has expired.";

/**
 * Read-only from the caller's point of view (returns info to render
 * the "set your password" page), but has one real, deliberate side
 * effect: successfully verifying the token transitions the User from
 * INVITED to EMAIL_VERIFIED. Clicking a link that could only have
 * arrived via the invitation email IS the email-verification act -
 * there's no separate "click here to verify your email" step on top
 * of the invitation link itself, since that would just be the same
 * proof asked for twice.
 */
export class VerifyInvitationUseCase {

    constructor(

        private readonly invitationRepository: IInvitationRepository,

        private readonly userRepository: IUserRepository,

        private readonly organizationRepository: IOrganizationRepository,

        private readonly createAuditLog: CreateAuditLogUseCase

    ) {}

    async execute(

        dto: VerifyInvitationDto

    ): Promise<VerifyInvitationResponseDto> {

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

        if (user.status === UserStatus.INVITED) {

            await this.userRepository.updateStatus(

                user.id!,

                UserStatus.EMAIL_VERIFIED

            );

            await this.createAuditLog.execute({

                organizationId: invitation.organizationId,

                userId: user.id,

                action: "EMAIL_VERIFIED",

                entityType: "User",

                entityId: user.id,

                method: "POST",

                path: "/api/v1/auth/verify-invitation",

                statusCode: 200,

            }).catch(() => {
                // Audit logging must never break the real verification.
            });

        }

        const organization =

            await this.organizationRepository.findById(
                invitation.organizationId
            );

        return {

            name: user.name,

            email: user.email,

            role: user.role,

            organizationName: organization?.name ?? ""

        };

    }

}
