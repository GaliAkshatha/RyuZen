import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyLeaderboardEntryUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<LeaderboardEntryResponseDto> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Only students have a leaderboard entry.",

                HttpStatus.FORBIDDEN

            );

        }

        const entry =

            await this.repository.findByStudentId(

                organizationId,

                student.id!

            );

        if (!entry) {

            throw new ApiError(

                "Leaderboard entry not found. It may not have been calculated yet.",

                HttpStatus.NOT_FOUND

            );

        }

        return LeaderboardEntryResponseMapper.toDto(

            entry

        );

    }

}
