import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

export class GetLeaderboardUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<LeaderboardEntryResponseDto[]> {

        const entries =

            await this.repository.findByOrganization(
                organizationId
            );

        return entries.map(

            entry =>

                LeaderboardEntryResponseMapper.toDto(
                    entry
                )

        );

    }

}
