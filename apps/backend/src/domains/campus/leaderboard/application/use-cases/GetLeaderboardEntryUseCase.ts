import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetLeaderboardEntryUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository

    ) {}

    async execute(

        organizationId: string,

        studentId: string

    ): Promise<LeaderboardEntryResponseDto> {

        const entry =

            await this.repository.findByStudentId(

                organizationId,

                studentId

            );

        if (!entry) {

            throw new ApiError(

                "Leaderboard entry not found for this student.",

                HttpStatus.NOT_FOUND

            );

        }

        return LeaderboardEntryResponseMapper.toDto(

            entry

        );

    }

}
