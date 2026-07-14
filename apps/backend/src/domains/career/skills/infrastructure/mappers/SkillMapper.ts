import { Skill } from "../../domain/entities/Skill.js";

import { SkillLevel } from "../../domain/constants/SkillLevel.js";

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
                data.verified

        };

    }

}
