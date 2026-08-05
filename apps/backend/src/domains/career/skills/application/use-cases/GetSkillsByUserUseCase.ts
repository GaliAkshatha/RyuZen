import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { SkillResponseDto } from "../dto/SkillResponseDto.js";

export class GetSkillsByUserUseCase {

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

        // Unapproved AI suggestions are not yet real skills — this
        // use case backs Resume Review's skill count and Career
        // Score's profile-completeness formula (both via
        // ISkillRepository -> here), so an unreviewed suggestion must
        // never silently inflate either score. Pending suggestions are
        // surfaced separately via GetPendingSkillSuggestionsUseCase.
        const approvedSkills =

            skills.filter(
                skill => skill.approved
            );

        return approvedSkills.map(

            skill =>

                SkillResponseMapper.toDto(
                    skill
                )

        );

    }

}
