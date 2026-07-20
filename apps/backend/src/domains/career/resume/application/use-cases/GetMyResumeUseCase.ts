import { IResumeRepository } from "../../infrastructure/repositories/IResumeRepository.js";

import { ResumeResponseMapper } from "../../infrastructure/mappers/ResumeResponseMapper.js";

import { ResumeResponseDto } from "../dto/ResumeResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyResumeUseCase {

    constructor(

        private readonly repository: IResumeRepository

    ) {}

    async execute(

        userId: string

    ): Promise<ResumeResponseDto> {

        const resume =

            await this.repository.findByUserId(
                userId
            );

        if (!resume) {

            throw new ApiError(

                "You have not generated a resume yet.",

                HttpStatus.NOT_FOUND

            );

        }

        return ResumeResponseMapper.toDto(

            resume

        );

    }

}
