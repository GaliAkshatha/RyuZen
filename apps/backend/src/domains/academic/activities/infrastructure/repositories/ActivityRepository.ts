import { Activity } from "../../domain/entities/Activity.js";

import { ActivityModel } from "../persistence/ActivityModel.js";

import { ActivityMapper } from "../mappers/ActivityMapper.js";

import { IActivityRepository } from "./IActivityRepository.js";
import { ActivityFilter } from "../../application/dto/ActivityFilter.js";
import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class ActivityRepository extends BaseRepository<Activity>
implements IActivityRepository {

    async create(

        activity: Activity

    ): Promise<Activity> {

        const document =

            await ActivityModel.create(

                ActivityMapper.toPersistence(

                    activity

                )

            );

        return ActivityMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Activity | null> {

        const document =

            await ActivityModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ActivityMapper.toDomain(

            document

        );

    }

    async findAll(

        filter: ActivityFilter

    ): Promise<Activity[]> {

        const query: Record<string, unknown> = {

            organizationId: filter.organizationId

        };
        if (filter.status) {

            query.status = filter.status;

        }

        if (filter.type) {

            query.type = filter.type;

        }

        if (filter.visibility) {

            query.visibility = filter.visibility;

        }

        if (filter.createdBy) {

            query.createdBy = filter.createdBy;

        }
        const documents =

            await ActivityModel.find(query)

            .sort({

                createdAt: -1

            });

        return documents.map(

            document =>

            ActivityMapper.toDomain(
                document
            )

        );

    }

    async save(

        activity: Activity

    ): Promise<Activity> {

        const document =

            await ActivityModel.findByIdAndUpdate(

                activity.id,

                ActivityMapper.toPersistence(

                    activity

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Activity not found."

            );

        }

        return ActivityMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await ActivityModel.findByIdAndDelete(

            id

        );

    }

}