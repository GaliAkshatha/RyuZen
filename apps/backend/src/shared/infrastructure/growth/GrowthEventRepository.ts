import { GrowthEvent } from "./GrowthEvent.js";

import { GrowthEventModel } from "./GrowthEventModel.js";

import { GrowthEventMapper } from "./GrowthEventMapper.js";

import { IGrowthEventRepository } from "./IGrowthEventRepository.js";

export class GrowthEventRepository
implements IGrowthEventRepository {

    async create(

        event: GrowthEvent

    ): Promise<GrowthEvent> {

        const document =
            await GrowthEventModel.create(

                GrowthEventMapper.toPersistence(
                    event
                )

            );

        return GrowthEventMapper.toDomain(
            document
        );

    }

    async findByStudentId(

        organizationId: string,

        studentId: string

    ): Promise<GrowthEvent[]> {

        const documents =
            await GrowthEventModel
                .find({ organizationId, studentId })
                .sort({ occurredAt: -1 });

        return documents.map(
            document => GrowthEventMapper.toDomain(document)
        );

    }

    async findByDomain(

        organizationId: string,

        domain: string

    ): Promise<GrowthEvent[]> {

        const documents =
            await GrowthEventModel
                .find({ organizationId, domain })
                .sort({ occurredAt: -1 });

        return documents.map(
            document => GrowthEventMapper.toDomain(document)
        );

    }

}
