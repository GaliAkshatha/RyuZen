import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

import { NotificationResponseMapper } from "../../infrastructure/mappers/NotificationResponseMapper.js";

import { NotificationResponseDto } from "../dto/NotificationResponseDto.js";

export class GetMyNotificationsUseCase {

    constructor(

        private readonly repository: INotificationRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string,

        role: string

    ): Promise<NotificationResponseDto[]> {

        const notifications =

            await this.repository.findForAudience(

                organizationId,

                role,

                userId

            );

        return notifications.map(

            notification =>

                NotificationResponseMapper.toDto(

                    notification,

                    userId

                )

        );

    }

}
