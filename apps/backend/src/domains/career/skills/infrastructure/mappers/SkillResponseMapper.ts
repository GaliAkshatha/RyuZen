import { Skill } from "../../domain/entities/Skill.js";

import { SkillResponseDto } from "../../application/dto/SkillResponseDto.js";

export class SkillResponseMapper {

    static toDto(

        skill: Skill

    ): SkillResponseDto {

        return {

            id:
                skill.id!,

            userId:
                skill.userId,

            name:
                skill.name,

            category:
                skill.category,

            level:
                skill.level,

            verified:
                skill.verified,

            createdAt:
                skill.createdAt,

            updatedAt:
                skill.updatedAt

        };

    }

}
