import { Education } from "../../domain/entities/Education.js";

import { IEducationRepository } from "../../infrastructure/repositories/IEducationRepository.js";

import { EducationResponseMapper } from "../../infrastructure/mappers/EducationResponseMapper.js";

import { CreateEducationDto } from "../dto/CreateEducationDto.js";
import { EducationResponseDto } from "../dto/EducationResponseDto.js";

export class CreateEducationUseCase {

    constructor(

        private readonly repository: IEducationRepository

    ) {}

    async execute(

        dto: CreateEducationDto,

        userId: string

    ): Promise<EducationResponseDto> {

        const education = Education.create({

            userId,

            institution:
                dto.institution,

            degree:
                dto.degree,

            branch:
                dto.branch,

            cgpa:
                dto.cgpa,

            startYear:
                dto.startYear,

            endYear:
                dto.endYear

        });

        const created =

            await this.repository.create(

                education

            );

        return EducationResponseMapper.toDto(

            created

        );

    }

}
