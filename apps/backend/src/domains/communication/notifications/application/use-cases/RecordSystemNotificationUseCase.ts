import { Notification } from "../../domain/entities/Notification.js";

import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";
import { NotificationType } from "../../domain/constants/NotificationType.js";

import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

/**
 * The system-generated counterpart to SendNotificationUseCase (which
 * remains the real, unchanged path for a human composing a broadcast).
 * Called internally by ReviewSubmissionUseCase, VerifyAchievementUseCase,
 * IssueCertificateUseCase, UpdateJobApplicationStatusUseCase, and
 * ExtractSkillsUseCase at the moment each of those does something a
 * specific student should be told about - not exposed as its own
 * public endpoint a client could call with an arbitrary recipient.
 *
 * Always creates with targetAudience: TARGETED, which deliberately
 * never matches the broadcast query in findForAudience - this
 * notification is only ever visible to `recipientUserId`.
 */
export class RecordSystemNotificationUseCase {

    constructor(

        private readonly repository: INotificationRepository

    ) {}

    async execute(

        params: {
            organizationId: string;
            recipientUserId: string;
            senderId: string;
            title: string;
            message: string;
            type?: NotificationType;
        }

    ): Promise<void> {

        const notification = Notification.create({

            organizationId:
                params.organizationId,

            senderId:
                params.senderId,

            title:
                params.title,

            message:
                params.message,

            type:
                params.type ?? NotificationType.INFO,

            targetAudience:
                NotificationAudience.TARGETED,

            recipientUserId:
                params.recipientUserId,

            readBy:
                []

        });

        await this.repository.create(

            notification

        );

    }

}
