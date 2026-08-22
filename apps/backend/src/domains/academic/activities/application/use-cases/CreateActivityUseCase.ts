import { Activity } from "../../domain/entities/Activity.js";

import { ActivityStatus } from "../../domain/constants/ActivityStatus.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

import { CreateActivityDto } from "../dto/CreateActivityDto.js";

import { ActivityResponseDto } from "../dto/ActivityResponseDto.js";

import { ActivityResponseMapper } from "../../infrastructure/mappers/ActivityResponseMapper.js";
import { AuthenticatedUser } from "../../../../../shared/types/AuthenticatedUser.js";

export class CreateActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        dto: CreateActivityDto,
        user: AuthenticatedUser

    ): Promise<ActivityResponseDto> {

        const activity = Activity.create({

            organizationId:
                user.organizationId,

            createdBy:
                user.userId,

            title:
                dto.title,

            description:
                dto.description,

            type:
                dto.type,

            status:
                ActivityStatus.DRAFT,

            visibility:
                dto.visibility,

            departmentIds:
                dto.departmentIds,

            batches:
                dto.batches,

            semesters:
                dto.semesters,

            sections:
                dto.sections,

            points:
                dto.points,

            penaltyPoints:
                dto.penaltyPoints,

            startDate:
                dto.startDate,

            endDate:
                dto.endDate,

            attachments:
                dto.attachments

        });

        const createdActivity =

            await this.repository.create(

                activity

            );

        return ActivityResponseMapper.toDto(

            createdActivity

        );

    }

}