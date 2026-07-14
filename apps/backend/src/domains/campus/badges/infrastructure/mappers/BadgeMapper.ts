import { Badge } from "../../domain/entities/Badge.js";

import {
    BadgeDocument
} from "../persistence/BadgeModel.js";

export class BadgeMapper {

    static toDomain(

        document: BadgeDocument

    ): Badge {

        return Badge.create({

            id:
                document.id,

            name:
                document.name,

            description:
                document.description,

            icon:
                document.icon,

            criteria:
                document.criteria,

            points:
                document.points,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        badge: Badge

    ) {

        const data =
            badge.toObject();

        return {

            name:
                data.name,

            description:
                data.description,

            icon:
                data.icon,

            criteria:
                data.criteria,

            points:
                data.points

        };

    }

}
