import { Event } from "../../domain/entities/Event.js";

import { EventStatus } from "../../domain/constants/EventStatus.js";

import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { EventResponseMapper } from "../../infrastructure/mappers/EventResponseMapper.js";

import { CreateEventDto } from "../dto/CreateEventDto.js";
import { EventResponseDto } from "../dto/EventResponseDto.js";

import {
    IClubRepository,
} from "../../../clubs/infrastructure/repositories/IClubRepository.js";

import { AuthenticatedUser } from "../../../../../shared/types/AuthenticatedUser.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateEventUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly clubRepository: IClubRepository

    ) {}

    async execute(

        dto: CreateEventDto,

        user: AuthenticatedUser

    ): Promise<EventResponseDto> {

        if (dto.clubId) {

            const club =

                await this.clubRepository.findById(
                    dto.clubId
                );

            if (

                !club ||
                club.organizationId !== user.organizationId

            ) {

                throw new ApiError(

                    "Club not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        const event = Event.create({

            organizationId:
                user.organizationId,

            clubId:
                dto.clubId,

            createdBy:
                user.userId,

            title:
                dto.title,

            description:
                dto.description,

            venue:
                dto.venue,

            startDate:
                dto.startDate,

            endDate:
                dto.endDate,

            registrationDeadline:
                dto.registrationDeadline,

            capacity:
                dto.capacity,

            points:
                dto.points ?? 0,

            certificateEnabled:
                dto.certificateEnabled ?? false,

            status:
                EventStatus.DRAFT

        });

        const created =

            await this.repository.create(

                event

            );

        return EventResponseMapper.toDto(

            created

        );

    }

}
