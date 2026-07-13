import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { EventResponseMapper } from "../../infrastructure/mappers/EventResponseMapper.js";

import { EventResponseDto } from "../dto/EventResponseDto.js";

export interface GetEventsFilterDto {

    clubId?: string;

    status?: string;

}

export class GetEventsUseCase {

    constructor(

        private readonly repository: IEventRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetEventsFilterDto

    ): Promise<EventResponseDto[]> {

        const events =

            await this.repository.findByOrganization(

                organizationId,

                {

                    clubId: filters.clubId,

                    status: filters.status

                }

            );

        return events.map(

            event =>

                EventResponseMapper.toDto(
                    event
                )

        );

    }

}
