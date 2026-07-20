import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

export class GetResumeTemplatesUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository

    ) {}

    async execute(): Promise<ResumeTemplateResponseDto[]> {

        const templates =

            await this.repository.findAll();

        return templates.map(

            template =>

                ResumeTemplateResponseMapper.toDto(
                    template
                )

        );

    }

}
