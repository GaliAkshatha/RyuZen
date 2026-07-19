import { IExperienceRepository } from "../../infrastructure/repositories/IExperienceRepository.js";

import { ExperienceResponseMapper } from "../../infrastructure/mappers/ExperienceResponseMapper.js";

import { ExperienceResponseDto } from "../dto/ExperienceResponseDto.js";

export class GetExperiencesByUserUseCase {

    constructor(

        private readonly repository: IExperienceRepository

    ) {}

    async execute(

        userId: string

    ): Promise<ExperienceResponseDto[]> {

        const experiences =

            await this.repository.findByUserId(
                userId
            );

        return experiences.map(

            experience =>

                ExperienceResponseMapper.toDto(
                    experience
                )

        );

    }

}
