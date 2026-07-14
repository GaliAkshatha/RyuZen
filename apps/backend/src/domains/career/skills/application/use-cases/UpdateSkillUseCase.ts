import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { UpdateSkillDto } from "../dto/UpdateSkillDto.js";
import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateSkillUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdateSkillDto

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

        if (skill.userId !== userId) {

            throw new ApiError(

                "You can only update your own skills.",

                HttpStatus.FORBIDDEN

            );

        }

        skill.updateDetails(dto);

        const updated =

            await this.repository.save(
                skill
            );

        return SkillResponseMapper.toDto(

            updated

        );

    }

}
