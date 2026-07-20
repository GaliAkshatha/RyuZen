import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

import { NotificationResponseMapper } from "../../infrastructure/mappers/NotificationResponseMapper.js";

import { NotificationResponseDto } from "../dto/NotificationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class MarkNotificationReadUseCase {

    constructor(

        private readonly repository: INotificationRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        userId: string

    ): Promise<NotificationResponseDto> {

        const notification =

            await this.repository.findById(
                id
            );

        if (

            !notification ||
            notification.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Notification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        notification.markReadBy(

            userId

        );

        const updated =

            await this.repository.save(
                notification
            );

        return NotificationResponseMapper.toDto(

            updated,

            userId

        );

    }

}
