import { randomBytes } from "crypto";

import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import {
    IOrganizationRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationRepository.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { IEmailService } from "../../../../shared/infrastructure/email/IEmailService.js";
import { buildInvitationEmail } from "../../../../shared/infrastructure/email/emailTemplates.js";
import { env } from "../../../../config/env.js";

import { InvitationResponseDto } from "../dto/InvitationResponseDto.js";
import { InvitationResponseMapper } from "../../infrastructure/mappers/InvitationResponseMapper.js";
import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

const DEFAULT_INVITATION_TTL_DAYS = 7;

/**
 * Reissues a brand new token/expiry on the SAME invitation record
 * (Invitation.reissue) rather than creating a duplicate row - an
 * invitation and its resend are the same real invitation, not two.
 * Works whether the invitation is still PENDING (a genuine resend) or
 * has EXPIRED, since both cases mean "this person still needs a
 * working link".
 */
export class ResendInvitationUseCase {

    constructor(

        private readonly invitationRepository: IInvitationRepository,

        private readonly organizationRepository: IOrganizationRepository,

        private readonly emailService: IEmailService,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

    ) {}

    async execute(

        invitationId: string,

        organizationId: string

    ): Promise<InvitationResponseDto> {

        const invitation =

            await this.invitationRepository.findById(
                invitationId
            );

        if (

            !invitation ||
            invitation.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Invitation not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (invitation.status === InvitationStatus.ACCEPTED) {

            throw new ApiError(

                "This invitation has already been accepted.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (invitation.status === InvitationStatus.REVOKED) {

            throw new ApiError(

                "This invitation was revoked. Create a new one instead.",

                HttpStatus.BAD_REQUEST

            );

        }

        const organization =

            await this.organizationRepository.findById(
                organizationId
            );

        if (!organization) {

            throw new ApiError(

                "Organization not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const rawToken =

            randomBytes(32).toString("hex");

        const tokenHash =

            hashToken(
                rawToken
            );

        const orgSettings =

            await this.organizationSettingsRepository.findByOrganizationId(
                organizationId
            );

        const invitationExpiryDays =
            orgSettings?.security.invitationExpiryDays ?? DEFAULT_INVITATION_TTL_DAYS;

        const expiresAt =

            new Date(
                Date.now() + invitationExpiryDays * 24 * 60 * 60 * 1000
            );

        invitation.reissue(

            tokenHash,

            expiresAt

        );

        const saved =

            await this.invitationRepository.save(
                invitation
            );

        const acceptUrl =

            `${env.FRONTEND_URL}/auth/accept-invitation?email=${encodeURIComponent(invitation.email)}&token=${rawToken}`;

        const { subject, html } = buildInvitationEmail({

            inviteeName: saved.email,

            organizationName: organization.name,

            role: saved.role,

            acceptUrl

        });

        await this.emailService.send({

            to: saved.email,

            subject,

            html

        });

        return InvitationResponseMapper.toDto(

            saved

        );

    }

}
