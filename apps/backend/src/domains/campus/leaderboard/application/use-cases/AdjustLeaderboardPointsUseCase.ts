import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { AdjustLeaderboardPointsDto } from "../dto/AdjustLeaderboardPointsDto.js";
import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AdjustLeaderboardPointsUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        organizationId: string,

        studentId: string,

        dto: AdjustLeaderboardPointsDto

    ): Promise<LeaderboardEntryResponseDto> {

        const student =

            await this.studentRepository.findById(
                studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const existing =

            await this.repository.findByStudentId(

                organizationId,

                studentId

            );

        const activityPoints =

            existing?.activityPoints ?? 0;

        const eventPoints =

            existing?.eventPoints ?? 0;

        const clubPoints =

            dto.clubPoints ?? existing?.clubPoints ?? 0;

        const placementPoints =

            dto.placementPoints ?? existing?.placementPoints ?? 0;

        const entry = LeaderboardEntry.create({

            id:
                existing?.id,

            organizationId,

            studentId,

            activityPoints,

            clubPoints,

            eventPoints,

            placementPoints,

            totalPoints:
                activityPoints + clubPoints + eventPoints + placementPoints,

            rank:
                existing?.rank ?? 0

        });

        await this.repository.upsert(

            entry

        );

        const ranked =

            await this.repository.reRank(

                organizationId

            );

        const updated =

            ranked.find(

                item => item.studentId === studentId

            )!;

        return LeaderboardEntryResponseMapper.toDto(

            updated

        );

    }

}
