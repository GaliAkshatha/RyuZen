import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { EventResponseMapper } from "../../infrastructure/mappers/EventResponseMapper.js";

import { UpdateEventDto } from "../dto/UpdateEventDto.js";
import { EventResponseDto } from "../dto/EventResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateEventUseCase {

    constructor(

        private readonly repository: IEventRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateEventDto

    ): Promise<EventResponseDto> {

        const event =

            await this.repository.findById(
                id
            );

        if (

            !event ||
            event.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Event not found.",

                HttpStatus.NOT_FOUND

            );

        }

        event.updateDetails(dto);

        const updated =

            await this.repository.save(
                event
            );

        return EventResponseMapper.toDto(

            updated

        );

    }

}
