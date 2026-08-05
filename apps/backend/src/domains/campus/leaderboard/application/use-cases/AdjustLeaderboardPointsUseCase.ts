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

import { RecordPointTransactionUseCase } from "../../../point-ledger/application/use-cases/RecordPointTransactionUseCase.js";

/**
 * Records the real DELTA, not the new absolute total — this use case
 * sets clubPoints/placementPoints to whatever value the admin
 * provides, so the actual transaction is the difference from what was
 * there before (RecordPointTransactionUseCase already skips
 * zero-point transactions, so a no-op adjustment correctly records
 * nothing).
 */
export class AdjustLeaderboardPointsUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordPointTransaction: RecordPointTransactionUseCase

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

        const previousClubPoints =
            existing?.clubPoints ?? 0;

        const previousPlacementPoints =
            existing?.placementPoints ?? 0;

        const clubPoints =

            dto.clubPoints ?? previousClubPoints;

        const placementPoints =

            dto.placementPoints ?? previousPlacementPoints;

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

        const clubDelta = clubPoints - previousClubPoints;
        const placementDelta = placementPoints - previousPlacementPoints;

        if (clubDelta !== 0) {

            await this.recordPointTransaction.execute({
                organizationId,
                studentId,
                points: clubDelta,
                reason: `Manual club points adjustment by admin (${clubDelta > 0 ? "+" : ""}${clubDelta})`
            });

        }

        if (placementDelta !== 0) {

            await this.recordPointTransaction.execute({
                organizationId,
                studentId,
                points: placementDelta,
                reason: `Manual placement points adjustment by admin (${placementDelta > 0 ? "+" : ""}${placementDelta})`
            });

        }

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
