import { RegisterUserDto } from "../dto/RegisterUserDto.js";
import { RegisterUserResponseDto } from "../dto/RegisterUserResponseDto.js";

import { User } from "../../domain/entities/User.js";
import { UserRole } from "../../domain/constants/UserRole.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";
import { IOrganizationRepository } from "../../../organizations/infrastructure/repositories/IOrganizationRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class RegisterUserUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly organizationRepository: IOrganizationRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: RegisterUserDto

    ): Promise<RegisterUserResponseDto> {

        // Find organization
        const organization =
            await this.organizationRepository.findByCode(
                dto.organizationCode
            );

        if (!organization) {

            throw new ApiError(

                "Organization not found.",

                HttpStatus.NOT_FOUND

            );

        }

        // Check duplicate email
        const exists =
            await this.userRepository.existsByEmail(
                dto.email
            );

        if (exists) {

            throw new ApiError(

                "Email already registered.",

                HttpStatus.CONFLICT

            );

        }

        // Hash password
        const passwordHash =
            await this.passwordHasher.hash(
                dto.password
            );

        // Create domain entity
        const user = new User({

            organizationId: organization.id!,

            name: dto.name,

            email: dto.email,

            role: UserRole.STUDENT,

            permissions: [],

            status: UserStatus.PENDING,

            joinedAt: new Date(),

            profile: {

                image: "",

                phone: "",

                bio: ""

            },

            auth: {

                passwordHash,

                emailVerified: false,

                failedAttempts: 0

            }

        });

        // Save user
        const createdUser =
            await this.userRepository.create(
                user
            );

        // Return safe response
        return {

            id: createdUser.id!,

            organizationId:
                createdUser.organizationId,

            name:
                createdUser.name,

            email:
                createdUser.email,

            role:
                createdUser.role,

            status:
                createdUser.status

        };

    }

}