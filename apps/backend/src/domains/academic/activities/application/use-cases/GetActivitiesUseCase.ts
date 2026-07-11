import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";
import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

export class GetActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string

    ): Promise<ActivityResponseDto> {

        const activity =
            await this.repository.findById(id);

        if (!activity) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return ActivityResponseMapper.toDto(activity);

    }

}