import { GrowthEvent } from "./GrowthEvent.js";

import { GrowthEventDocument } from "./GrowthEventModel.js";

export class GrowthEventMapper {

    static toDomain(

        document: GrowthEventDocument

    ): GrowthEvent {

        return GrowthEvent.fromPersisted({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            studentId:
                document.studentId.toString(),

            domain:
                document.domain,

            eventType:
                document.eventType,

            evidence:
                document.evidence,

            verifiedBy:
                document.verifiedBy,

            contributionWeight:
                document.contributionWeight,

            occurredAt:
                document.occurredAt

        });

    }

    static toPersistence(

        event: GrowthEvent

    ) {

        const data =
            event.toObject();

        return {

            organizationId:
                data.organizationId,

            studentId:
                data.studentId,

            domain:
                data.domain,

            eventType:
                data.eventType,

            evidence:
                data.evidence,

            verifiedBy:
                data.verifiedBy,

            contributionWeight:
                data.contributionWeight,

            occurredAt:
                data.occurredAt

        };

    }

}
