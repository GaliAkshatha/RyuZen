import { Notification } from "../../domain/entities/Notification.js";

import { NotificationModel } from "../persistence/NotificationModel.js";

import { NotificationMapper } from "../mappers/NotificationMapper.js";

import { INotificationRepository } from "./INotificationRepository.js";

export class NotificationRepository
implements INotificationRepository {

    async create(

        notification: Notification

    ): Promise<Notification> {

        const document =

            await NotificationModel.create(

                NotificationMapper.toPersistence(

                    notification

                )

            );

        return NotificationMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Notification | null> {

        const document =

            await NotificationModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return NotificationMapper.toDomain(

            document

        );

    }

    async findForAudience(

        organizationId: string,

        audience: string

    ): Promise<Notification[]> {

        const documents =

            await NotificationModel.find({

                organizationId,

                targetAudience: {

                    $in: ["ALL", audience]

                }

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                NotificationMapper.toDomain(
                    document
                )

        );

    }

    async save(

        notification: Notification

    ): Promise<Notification> {

        const document =

            await NotificationModel.findByIdAndUpdate(

                notification.id,

                NotificationMapper.toPersistence(

                    notification

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Notification not found."

            );

        }

        return NotificationMapper.toDomain(

            document

        );

    }

}
