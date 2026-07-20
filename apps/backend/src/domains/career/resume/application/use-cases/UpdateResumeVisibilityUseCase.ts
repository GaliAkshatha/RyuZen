import { Resume } from "../../domain/entities/Resume.js";

import { ResumeVisibility } from "../../domain/constants/ResumeVisibility.js";

import { IResumeRepository } from "../../infrastructure/repositories/IResumeRepository.js";

import { ResumeResponseMapper } from "../../infrastructure/mappers/ResumeResponseMapper.js";

import { UpdateResumeVisibilityDto } from "../dto/UpdateResumeVisibilityDto.js";
import { ResumeResponseDto } from "../dto/ResumeResponseDto.js";

export class UpdateResumeVisibilityUseCase {

    constructor(

        private readonly repository: IResumeRepository

    ) {}

    async execute(

        userId: string,

        dto: UpdateResumeVisibilityDto

    ): Promise<ResumeResponseDto> {

        let resume =

            await this.repository.findByUserId(
                userId
            );

        if (!resume) {

            resume = Resume.create({

                userId,

                visibility:
                    ResumeVisibility.PRIVATE

            });

        }

        resume.updateVisibility(

            dto.visibility

        );

        const updated =

            await this.repository.upsert(

                resume

            );

        return ResumeResponseMapper.toDto(

            updated

        );

    }

}
