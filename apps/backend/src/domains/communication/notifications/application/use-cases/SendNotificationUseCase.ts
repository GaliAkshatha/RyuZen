import { Notification } from "../../domain/entities/Notification.js";

import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

import { NotificationResponseMapper } from "../../infrastructure/mappers/NotificationResponseMapper.js";

import { SendNotificationDto } from "../dto/SendNotificationDto.js";
import { NotificationResponseDto } from "../dto/NotificationResponseDto.js";

export class SendNotificationUseCase {

    constructor(

        private readonly repository: INotificationRepository

    ) {}

    async execute(

        dto: SendNotificationDto,

        organizationId: string,

        senderId: string

    ): Promise<NotificationResponseDto> {

        const notification = Notification.create({

            organizationId,

            senderId,

            title:
                dto.title,

            message:
                dto.message,

            type:
                dto.type,

            targetAudience:
                dto.targetAudience ?? NotificationAudience.ALL,

            readBy:
                []

        });

        const created =

            await this.repository.create(

                notification

            );

        return NotificationResponseMapper.toDto(

            created,

            senderId

        );

    }

}
