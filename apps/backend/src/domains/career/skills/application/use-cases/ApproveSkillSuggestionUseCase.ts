import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";
import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Rejection deliberately reuses the existing DeleteSkillUseCase rather
 * than a parallel "reject" use case - rejecting an AI suggestion and
 * deleting a skill are the same real action from the student's point
 * of view, and DeleteSkillUseCase already enforces ownership correctly.
 */
export class ApproveSkillSuggestionUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        skillId: string,

        userId: string

    ): Promise<SkillResponseDto> {

        const skill =

            await this.repository.findById(
                skillId
            );

        if (!skill) {

            throw new ApiError(
                "Skill not found.",
                HttpStatus.NOT_FOUND
            );

        }

        if (skill.userId !== userId) {

            throw new ApiError(
                "You can only approve your own skill suggestions.",
                HttpStatus.FORBIDDEN
            );

        }

        if (skill.approved) {

            throw new ApiError(
                "This skill has already been approved.",
                HttpStatus.BAD_REQUEST
            );

        }

        skill.approve();

        const saved =

            await this.repository.save(
                skill
            );

        return SkillResponseMapper.toDto(
            saved
        );

    }

}
