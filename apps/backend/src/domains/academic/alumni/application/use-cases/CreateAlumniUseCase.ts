import { Alumni } from "../../domain/entities/Alumni.js";

import { AlumniStatus } from "../../domain/constants/AlumniStatus.js";

import { IAlumniRepository } from "../../infrastructure/repositories/IAlumniRepository.js";

import { AlumniResponseMapper } from "../../infrastructure/mappers/AlumniResponseMapper.js";

import { CreateAlumniDto } from "../dto/CreateAlumniDto.js";
import { AlumniResponseDto } from "../dto/AlumniResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateAlumniUseCase {

    constructor(

        private readonly repository: IAlumniRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        dto: CreateAlumniDto,

        organizationId: string

    ): Promise<AlumniResponseDto> {

        const user =

            await this.userRepository.findById(
                dto.userId
            );

        if (

            !user ||
            user.organizationId !== organizationId

        ) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role !== UserRole.ALUMNI) {

            throw new ApiError(

                "User must have the ALUMNI role.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alreadyLinked =

            await this.repository.existsByUserId(
                dto.userId
            );

        if (alreadyLinked) {

            throw new ApiError(

                "An alumni record already exists for this user.",

                HttpStatus.CONFLICT

            );

        }

        const emailTaken =

            await this.repository.existsByEmail(

                organizationId,

                user.email

            );

        if (emailTaken) {

            throw new ApiError(

                "An alumni record already exists for this email.",

                HttpStatus.CONFLICT

            );

        }

        const alumni = Alumni.create({

            organizationId,

            userId:
                dto.userId,

            email:
                user.email,

            name:
                user.name,

            graduationYear:
                dto.graduationYear,

            company:
                dto.company,

            designation:
                dto.designation,

            isVerified:
                false,

            status:
                AlumniStatus.ACTIVE

        });

        const created =

            await this.repository.create(

                alumni

            );

        return AlumniResponseMapper.toDto(

            created

        );

    }

}
