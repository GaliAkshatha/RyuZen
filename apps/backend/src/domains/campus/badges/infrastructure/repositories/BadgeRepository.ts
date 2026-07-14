import { Badge } from "../../domain/entities/Badge.js";

import { BadgeModel } from "../persistence/BadgeModel.js";

import { BadgeMapper } from "../mappers/BadgeMapper.js";

import { IBadgeRepository } from "./IBadgeRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class BadgeRepository extends BaseRepository<Badge>
implements IBadgeRepository {

    async create(

        badge: Badge

    ): Promise<Badge> {

        const document =

            await BadgeModel.create(

                BadgeMapper.toPersistence(

                    badge

                )

            );

        return BadgeMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Badge | null> {

        const document =

            await BadgeModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return BadgeMapper.toDomain(

            document

        );

    }

    async findAll(): Promise<Badge[]> {

        const documents =

            await BadgeModel.find()

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                BadgeMapper.toDomain(
                    document
                )

        );

    }

    async existsByName(

        name: string

    ): Promise<boolean> {

        const document =

            await BadgeModel.findOne({

                name

            });

        return !!document;

    }

    async save(

        badge: Badge

    ): Promise<Badge> {

        const document =

            await BadgeModel.findByIdAndUpdate(

                badge.id,

                BadgeMapper.toPersistence(

                    badge

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Badge not found."

            );

        }

        return BadgeMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await BadgeModel.findByIdAndDelete(

            id

        );

    }

}
