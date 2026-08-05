import { CodingProfile } from "../../domain/entities/CodingProfile.js";

import { ICodingProfileRepository } from "../../infrastructure/repositories/ICodingProfileRepository.js";
import { ICodingPlatformApiClient } from "../ports/ICodingPlatformApiClient.js";

import { CodingProfileResponseMapper } from "../../infrastructure/mappers/CodingProfileResponseMapper.js";

import { LinkCodingProfileDto } from "../dto/LinkCodingProfileDto.js";
import { CodingProfileResponseDto } from "../dto/CodingProfileResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Verified institutional data, not self-declared claims" - a student
 * typing a handle is not evidence on its own. This calls the real
 * platform API to confirm the handle genuinely exists before ever
 * marking the profile verified or saving any real stat - a typo'd or
 * fabricated handle is genuinely rejected, not silently accepted.
 * The stats fetched during this same real API call are saved
 * immediately, so a freshly-linked profile already has real data
 * rather than showing empty until the next sync.
 */
export class LinkCodingProfileUseCase {

    constructor(

        private readonly repository: ICodingProfileRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly apiClient: ICodingPlatformApiClient

    ) {}

    async execute(

        organizationId: string,

        requestingUserId: string,

        dto: LinkCodingProfileDto

    ): Promise<CodingProfileResponseDto> {

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "Only a student can link a coding profile.",

                HttpStatus.FORBIDDEN

            );

        }

        const existing =

            await this.repository.findByStudentAndPlatform(
                student.id!,
                dto.platform
            );

        if (existing) {

            throw new ApiError(

                "You've already linked a profile for this platform.",

                HttpStatus.CONFLICT

            );

        }

        const stats =

            await this.apiClient.fetchStats(
                dto.handle
            );

        if (!stats.exists) {

            throw new ApiError(

                `No real ${dto.platform} account was found for handle "${dto.handle}".`,

                HttpStatus.BAD_REQUEST

            );

        }

        const profile = CodingProfile.create({

            organizationId,

            studentId: student.id!,

            platform: dto.platform,

            handle: dto.handle,

            verified: true,

            currentRating: stats.currentRating,

            maxRating: stats.maxRating,

            rank: stats.rank,

            problemsSolved: stats.problemsSolved,

            lastSyncedAt: new Date()

        });

        const created =

            await this.repository.create(
                profile
            );

        return CodingProfileResponseMapper.toDto(

            created

        );

    }

}
