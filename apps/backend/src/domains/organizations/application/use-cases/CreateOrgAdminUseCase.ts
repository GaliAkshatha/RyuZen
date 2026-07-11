import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { User } from "../../../identity/domain/entities/User.js";
import { UserRole } from "../../../identity/domain/constants/UserRole.js";
import { UserStatus } from "../../../identity/domain/constants/UserStatus.js";

import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

import { IUserRepository } from "../../../identity/infrastructure/repositories/IUserRepository.js";
import { IOrganizationRepository } from "../../infrastructure/repositories/IOrganizationRepository.js";

import { IPasswordHasher } from "../../../identity/application/ports/IPasswordHasher.js";

import { CreateOrgAdminDto } from "../dto/CreateOrgAdminDto.js";
import { CreateOrgAdminResponseDto } from "../dto/CreateOrgAdminResponseDto.js";

export class CreateOrgAdminUseCase {

    constructor(

        private readonly organizationRepository: IOrganizationRepository,

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: CreateOrgAdminDto

    ): Promise<CreateOrgAdminResponseDto> {

        const organization =

            await this.organizationRepository.findById(

                dto.organizationId

            );

        if (!organization) {

            throw new ApiError(

                "Organization not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const emailExists =

            await this.userRepository.existsByEmail(

                dto.email

            );

        if (emailExists) {

            throw new ApiError(

                "Email already exists.",

                HttpStatus.CONFLICT

            );

        }

        const passwordHash =

            await this.passwordHasher.hash(

                dto.password

            );

        const user = new User({

            organizationId: organization.id!,

            name: dto.name,

            email: dto.email,

            role: UserRole.ORG_ADMIN,

            permissions: [

                Permission.MANAGE_ORGANIZATION,

                Permission.MANAGE_USERS,

                Permission.MANAGE_DEPARTMENTS,

                Permission.MANAGE_CLUBS,

                Permission.CREATE_ACTIVITY,

                Permission.UPDATE_ACTIVITY,

                Permission.DELETE_ACTIVITY,

                Permission.REVIEW_SUBMISSION,

                Permission.VIEW_LEADERBOARD,

                Permission.CREATE_EVENT,

                Permission.MANAGE_EVENTS,

                Permission.SEND_NOTIFICATION,

                Permission.MANAGE_PROJECTS,

                Permission.VIEW_ANALYTICS

            ],

            status: UserStatus.ACTIVE,

            joinedAt: new Date(),

            profile: {

                image: "",

                phone: "",

                bio: ""

            },

            auth: {

                passwordHash,

                emailVerified: true,

                failedAttempts: 0

            }

        });

        const created =

            await this.userRepository.create(

                user

            );

        return {

            id: created.id!,

            organizationId: created.organizationId,

            name: created.name,

            email: created.email,

            role: created.role,

            status: created.status

        };

    }

}