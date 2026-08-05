import { Skill } from "../../domain/entities/Skill.js";
import { SkillSource } from "../../domain/constants/SkillSource.js";

import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { CreateSkillDto } from "../dto/CreateSkillDto.js";
import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateSkillUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        dto: CreateSkillDto,

        userId: string

    ): Promise<SkillResponseDto> {

        const exists =

            await this.repository.existsByUserIdAndName(

                userId,

                dto.name

            );

        if (exists) {

            throw new ApiError(

                "You already have a skill with this name.",

                HttpStatus.CONFLICT

            );

        }

        const skill = Skill.create({

            userId,

            name:
                dto.name,

            category:
                dto.category,

            level:
                dto.level,

            verified:
                false,

            source:
                SkillSource.MANUAL,

            approved:
                true

        });

        const created =

            await this.repository.create(

                skill

            );

        return SkillResponseMapper.toDto(

            created

        );

    }

}
