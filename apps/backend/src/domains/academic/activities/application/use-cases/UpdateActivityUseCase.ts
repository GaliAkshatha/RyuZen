import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { UpdateActivityDto } from "../dto/UpdateActivityDto.js";
import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";
import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

export class UpdateActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string,

        dto: UpdateActivityDto

    ): Promise<ActivityResponseDto> {

        const activity =

            await this.repository.findById(id);

        if (!activity) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        activity.updateDetails(dto);

        const updated =

            await this.repository.save(activity);

        return ActivityResponseMapper.toDto(updated);

    }

}