import { Achievement } from "../../domain/entities/Achievement.js";

import { AchievementModel } from "../persistence/AchievementModel.js";

import { AchievementMapper } from "../mappers/AchievementMapper.js";

import { IAchievementRepository, AchievementFilters } from "./IAchievementRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class AchievementRepository extends BaseRepository<Achievement>
implements IAchievementRepository {

    async create(

        achievement: Achievement

    ): Promise<Achievement> {

        const document =

            await AchievementModel.create(

                AchievementMapper.toPersistence(

                    achievement

                )

            );

        return AchievementMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Achievement | null> {

        const document =

            await AchievementModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return AchievementMapper.toDomain(

            document

        );

    }

    async findByStudent(

        studentId: string,

        filters: AchievementFilters

    ): Promise<Achievement[]> {

        const query: Record<string, unknown> = {

            studentId,

        };

        if (filters.status) {

            query.status =

                filters.status;

        }

        const documents =

            await AchievementModel.find(query)

                .sort({

                    achievementDate: -1

                });

        return documents.map(

            document =>

                AchievementMapper.toDomain(
                    document
                )

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: AchievementFilters

    ): Promise<Achievement[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.status) {

            query.status =

                filters.status;

        }

        const documents =

            await AchievementModel.find(query)

                .sort({

                    achievementDate: -1

                });

        return documents.map(

            document =>

                AchievementMapper.toDomain(
                    document
                )

        );

    }

    async save(

        achievement: Achievement

    ): Promise<Achievement> {

        const document =

            await AchievementModel.findByIdAndUpdate(

                achievement.id,

                AchievementMapper.toPersistence(

                    achievement

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Achievement not found."

            );

        }

        return AchievementMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await AchievementModel.findByIdAndDelete(

            id

        );

    }

}
