import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { EventResponseMapper } from "../../infrastructure/mappers/EventResponseMapper.js";

import { EventResponseDto } from "../dto/EventResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetEventUseCase {

    constructor(

        private readonly repository: IEventRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

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

        return EventResponseMapper.toDto(

            event

        );

    }

}
