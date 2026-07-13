import { randomBytes } from "crypto";

import { Alumni } from "../../domain/entities/Alumni.js";

import { AlumniStatus } from "../../domain/constants/AlumniStatus.js";

import { IAlumniRepository } from "../../infrastructure/repositories/IAlumniRepository.js";

import { InviteAlumniDto } from "../dto/InviteAlumniDto.js";
import { InviteAlumniResponseDto } from "../dto/InviteAlumniResponseDto.js";

import {
    IPasswordHasher,
} from "../../../../identity/application/ports/IPasswordHasher.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class InviteAlumniUseCase {

    private readonly TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

    constructor(

        private readonly repository: IAlumniRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: InviteAlumniDto,

        organizationId: string

    ): Promise<InviteAlumniResponseDto> {

        const emailTaken =

            await this.repository.existsByEmail(

                organizationId,

                dto.email

            );

        if (emailTaken) {

            throw new ApiError(

                "An alumni record already exists for this email.",

                HttpStatus.CONFLICT

            );

        }

        const inviteToken =

            randomBytes(32).toString("hex");

        const inviteTokenHash =

            await this.passwordHasher.hash(
                inviteToken
            );

        const inviteExpiresAt =

            new Date(
                Date.now() + this.TOKEN_TTL_MS
            );

        const alumni = Alumni.create({

            organizationId,

            email:
                dto.email,

            name:
                dto.name,

            graduationYear:
                dto.graduationYear,

            isVerified:
                false,

            status:
                AlumniStatus.INVITED,

            inviteTokenHash,

            inviteExpiresAt

        });

        const created =

            await this.repository.create(

                alumni

            );

        // TODO: deliver via the Notifications/Email module once available.
        // Returned directly for now since no email delivery infrastructure exists yet.
        return {

            id:
                created.id!,

            email:
                created.email,

            inviteToken

        };

    }

}
