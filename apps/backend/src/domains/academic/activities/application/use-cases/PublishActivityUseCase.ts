import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";
import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

/** SECURITY FIX: same real org+ownership gap as UpdateActivityUseCase, same fix. */
export class PublishActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        requesterId: string,

        requesterRole: UserRole

    ): Promise<ActivityResponseDto> {

        const activity =

            await this.repository.findById(

                id

            );

        if (

            !activity ||
            activity.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (

            requesterRole !== UserRole.SUPER_ADMIN &&
            activity.createdBy !== requesterId

        ) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        activity.publish();

        const updated =

            await this.repository.save(

                activity

            );

        return ActivityResponseMapper.toDto(

            updated

        );

    }

}
