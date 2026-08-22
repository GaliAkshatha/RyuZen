import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { UpdateActivityDto } from "../dto/UpdateActivityDto.js";
import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";
import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY FIX: previously took only (id, dto) - no organizationId, no
 * ownership check at all. Any Faculty member in any organization could
 * edit any other organization's activities. Now enforces the same real
 * pattern already proven in ReviewSubmissionUseCase: organization
 * match, and only the activity's own creator or a SUPER_ADMIN may
 * modify it.
 */
export class UpdateActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        requesterId: string,

        requesterRole: UserRole,

        dto: UpdateActivityDto

    ): Promise<ActivityResponseDto> {

        const activity =

            await this.repository.findById(id);

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

        activity.updateDetails(dto);

        const updated =

            await this.repository.save(activity);

        return ActivityResponseMapper.toDto(updated);

    }

}
