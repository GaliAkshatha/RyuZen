import { ActivityFilter } from "../dto/ActivityFilter.js";
import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";
import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

export class ListActivitiesUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        filter: ActivityFilter

    ): Promise<ActivityResponseDto[]> {

        const activities =

            await this.repository.findAll(

                filter

            );

        return activities.map(

            activity =>

                ActivityResponseMapper.toDto(
                    activity
                )

        );

    }

}
