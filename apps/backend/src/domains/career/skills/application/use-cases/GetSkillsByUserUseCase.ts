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

        return skills.map(

            skill =>

                SkillResponseMapper.toDto(
                    skill
                )

        );

    }

}
