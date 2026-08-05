import { Skill } from "../../domain/entities/Skill.js";

import { SkillLevel } from "../../domain/constants/SkillLevel.js";
import { SkillSource } from "../../domain/constants/SkillSource.js";

import {
    SkillDocument
} from "../persistence/SkillModel.js";

export class SkillMapper {

    static toDomain(

        document: SkillDocument

    ): Skill {

        return Skill.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            name:
                document.name,

            category:
                document.category,

            level:
                document.level as SkillLevel | undefined,

            verified:
                document.verified,

            // Defaults preserve exact prior behavior for every skill
            // created before AI extraction existed: MANUAL and already
            // approved (nothing about existing records changes).
            source:
                (document.source as SkillSource | undefined) ?? SkillSource.MANUAL,

            confidence:
                document.confidence,

            evidence:
                document.evidence,

            approved:
                document.approved ?? true,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        skill: Skill

    ) {

        const data =
            skill.toObject();

        return {

            userId:
                data.userId,

            name:
                data.name,

            category:
                data.category,

            level:
                data.level,

            verified:
                data.verified,

            source:
                data.source,

            confidence:
                data.confidence,

            evidence:
                data.evidence,

            approved:
                data.approved

        };

    }

}
