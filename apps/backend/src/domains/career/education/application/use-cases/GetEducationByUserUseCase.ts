import { IEducationRepository } from "../../infrastructure/repositories/IEducationRepository.js";

import { EducationResponseMapper } from "../../infrastructure/mappers/EducationResponseMapper.js";

import { EducationResponseDto } from "../dto/EducationResponseDto.js";

export class GetEducationByUserUseCase {

    constructor(

        private readonly repository: IEducationRepository

    ) {}

    async execute(

        userId: string

    ): Promise<EducationResponseDto[]> {

        const educationEntries =

            await this.repository.findByUserId(
                userId
            );

        return educationEntries.map(

            education =>

                EducationResponseMapper.toDto(
                    education
                )

        );

    }

}
