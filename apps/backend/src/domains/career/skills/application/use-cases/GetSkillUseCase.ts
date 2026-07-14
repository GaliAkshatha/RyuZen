import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetSkillUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        id: string

    ): Promise<SkillResponseDto> {

        const skill =

            await this.repository.findById(
                id
            );

        if (!skill) {

            throw new ApiError(

                "Skill not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return SkillResponseMapper.toDto(

            skill

        );

    }

}
