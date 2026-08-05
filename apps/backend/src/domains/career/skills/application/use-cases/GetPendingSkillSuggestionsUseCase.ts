import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";
import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { SkillResponseDto } from "../dto/SkillResponseDto.js";
import { SkillSource } from "../../domain/constants/SkillSource.js";

/**
 * The counterpart to GetSkillsByUserUseCase's approved-only filter -
 * this returns exactly the AI-suggested skills still awaiting the
 * student's review, for the "Review Suggestions" UI.
 */
export class GetPendingSkillSuggestionsUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        userId: string

    ): Promise<SkillResponseDto[]> {

        const skills =

            await this.repository.findByUserId(
                userId
            );

        const pending =
            skills.filter(
                skill =>
                    skill.source === SkillSource.AI_SUGGESTED &&
                    !skill.approved
            );

        return pending.map(
            skill => SkillResponseMapper.toDto(skill)
        );

    }

}
