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

        audience: string,

        userId: string,

        viewerDepartmentId?: string

    ): Promise<Notification[]> {

        const departmentFilter = viewerDepartmentId
            ? {
                $or: [
                    { departmentIds: { $exists: false } },
                    { departmentIds: { $size: 0 } },
                    { departmentIds: viewerDepartmentId }
                ]
            }
            : {
                $or: [
                    { departmentIds: { $exists: false } },
                    { departmentIds: { $size: 0 } }
                ]
            };

        /*
         "ALL" is meant to reach every real member of this
         organization's own community (Student, Faculty, Alumni, Org
         Admin, Placement Admin) - not literally every authenticated
         role that merely shares this organizationId. Confirmed a real
         bug: a seeded Recruiter account has the same organizationId
         as the university they recruit from (correct, for real data
         scoping elsewhere), which meant an "ALL" campus announcement
         like "Welcome to the new semester, check the Activities tab"
         was reaching recruiters too - an external visitor with no
         activities tab at all. Super Admin is excluded for the same
         reason: platform-level, not a member of any one org's
         community.
        */
        const INTERNAL_ROLES = ["STUDENT", "FACULTY", "ALUMNI", "ORG_ADMIN", "PLACEMENT_ADMIN"];
        const audienceMatch = INTERNAL_ROLES.includes(audience) ? { $in: ["ALL", audience] } : audience;

        const documents =

            await NotificationModel.find({

                organizationId,

                $or: [
                    {
                        $and: [
                            { targetAudience: audienceMatch },
                            departmentFilter
                        ]
                    },
                    { recipientUserId: userId }
                ]

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
