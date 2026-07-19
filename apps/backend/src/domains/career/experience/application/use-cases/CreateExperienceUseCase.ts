import { Experience } from "../../domain/entities/Experience.js";

import { IExperienceRepository } from "../../infrastructure/repositories/IExperienceRepository.js";

import { ExperienceResponseMapper } from "../../infrastructure/mappers/ExperienceResponseMapper.js";

import { CreateExperienceDto } from "../dto/CreateExperienceDto.js";
import { ExperienceResponseDto } from "../dto/ExperienceResponseDto.js";

export class CreateExperienceUseCase {

    constructor(

        private readonly repository: IExperienceRepository

    ) {}

    async execute(

        dto: CreateExperienceDto,

        userId: string

    ): Promise<ExperienceResponseDto> {

        const experience = Experience.create({

            userId,

            company:
                dto.company,

            role:
                dto.role,

            employmentType:
                dto.employmentType,

            location:
                dto.location,

            startDate:
                dto.startDate,

            endDate:
                dto.endDate,

            currentlyWorking:
                dto.currentlyWorking ?? false,

            description:
                dto.description,

            skills:
                dto.skills ?? []

        });

        const created =

            await this.repository.create(

                experience

            );

        return ExperienceResponseMapper.toDto(

            created

        );

    }

}
