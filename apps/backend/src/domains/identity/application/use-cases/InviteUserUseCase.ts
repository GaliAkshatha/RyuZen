import { randomBytes } from "crypto";

import { User } from "../../domain/entities/User.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";
import { UserRole } from "../../domain/constants/UserRole.js";

import { Invitation } from "../../domain/entities/Invitation.js";
import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";
import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import {
    IOrganizationRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationRepository.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { IEmailService } from "../../../../shared/infrastructure/email/IEmailService.js";
import { buildInvitationEmail } from "../../../../shared/infrastructure/email/emailTemplates.js";
import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";
import { env } from "../../../../config/env.js";

import { InviteUserDto } from "../dto/InviteUserDto.js";
import { InvitationResponseDto } from "../dto/InvitationResponseDto.js";
import { InvitationResponseMapper } from "../../infrastructure/mappers/InvitationResponseMapper.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

const DEFAULT_INVITATION_TTL_DAYS = 7;

const INVITABLE_ROLES = [
    UserRole.PLACEMENT_ADMIN,
    UserRole.FACULTY,
    UserRole.STUDENT,
    UserRole.ALUMNI,
    UserRole.RECRUITER
];

/** PLACEMENT_ADMIN owns company/drive relationships and is the one who approves a real recruiter contact - matching "Recruiters gain access only after approval through the university placement process." They can only ever invite RECRUITER, never widen into Faculty/Student/Alumni/other admins - that stays ORG_ADMIN-only. */
const PLACEMENT_ADMIN_INVITABLE_ROLES = [UserRole.RECRUITER];

/**
 * The real admin-initiated user creation this whole system was
 * missing (confirmed by reading CreateStudentUseCase etc. directly -
 * they all require a User to already exist, none of them create one).
 *
 * Creates the User immediately with status=INVITED and an unusable,
 * random 256-bit password hash (never a fixed sentinel or empty
 * string - even if login enforcement were ever bypassed, there is no
 * predictable password to exploit) - the real password is set later
 * in AcceptInvitationUseCase. The Invitation record tracks the
 * hashed token, mirroring the exact pattern already proven in
 * ForgotPasswordUseCase: raw token emailed, only the hash stored.
 *
 * Only creates the base identity (name/email/role) - academic-specific
 * data (department, USN, batch for students, etc.) is deliberately
 * left to the EXISTING CreateStudentUseCase/CreateFacultyUseCase/
 * CreateAlumniUseCase, called separately with the new userId, rather
 * than duplicating that logic here.
 */
export class InviteUserUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly invitationRepository: IInvitationRepository,

        private readonly organizationRepository: IOrganizationRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly emailService: IEmailService,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

    ) {}

    async execute(

        organizationId: string,

        invitedBy: string,

        invitedByRole: UserRole,

        dto: InviteUserDto

    ): Promise<InvitationResponseDto> {

        if (!INVITABLE_ROLES.includes(dto.role)) {

            throw new ApiError(

                "You can only invite Faculty, Students, Alumni, Placement Admins, or Recruiters.",

                HttpStatus.FORBIDDEN

            );

        }

        if (

            invitedByRole === UserRole.PLACEMENT_ADMIN &&
            !PLACEMENT_ADMIN_INVITABLE_ROLES.includes(dto.role)

        ) {

            throw new ApiError(

                "Placement Admins can only invite Recruiters.",

                HttpStatus.FORBIDDEN

            );

        }

        const alreadyExists =

            await this.userRepository.existsByEmail(
                dto.email
            );

        if (alreadyExists) {

            throw new ApiError(

                "A user with this email already exists.",

                HttpStatus.CONFLICT

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

        if (organization.emailDomains.length > 0) {

            const emailDomain = dto.email.split("@")[1]?.toLowerCase();

            const domainAllowed = organization.emailDomains.some(

                allowedDomain => allowedDomain.toLowerCase() === emailDomain

            );

            if (!domainAllowed) {

                throw new ApiError(

                    `This organization only allows invitations to these email domains: ${organization.emailDomains.join(", ")}.`,

                    HttpStatus.BAD_REQUEST

                );

            }

        }

        const unusablePasswordHash =

            await this.passwordHasher.hash(
                randomBytes(32).toString("hex")
            );

        const user = new User({

            organizationId,

            name: dto.name,

            email: dto.email,

            role: dto.role,

            permissions: [],

            status: UserStatus.INVITED,

            profile: {

                image: "",

                phone: "",

                bio: ""

            },

            auth: {

                passwordHash: unusablePasswordHash,

                emailVerified: false,

                failedAttempts: 0

            }

        });

        const createdUser =

            await this.userRepository.create(
                user
            );

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

        const invitation = Invitation.create({

            organizationId,

            userId: createdUser.id!,

            email: dto.email,

            role: dto.role,

            invitedBy,

            tokenHash,

            expiresAt,

            status: InvitationStatus.PENDING

        });

        const createdInvitation =

            await this.invitationRepository.create(
                invitation
            );

        const acceptUrl =

            `${env.FRONTEND_URL}/auth/accept-invitation?email=${encodeURIComponent(dto.email)}&token=${rawToken}`;

        const { subject, html } = buildInvitationEmail({

            inviteeName: dto.name,

            organizationName: organization.name,

            role: dto.role,

            acceptUrl

        });

        await this.emailService.send({

            to: dto.email,

            subject,

            html

        });

        return InvitationResponseMapper.toDto(

            createdInvitation

        );

    }

}
