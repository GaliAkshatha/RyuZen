import { IResumeRepository } from "../../infrastructure/repositories/IResumeRepository.js";

import { ResumeResponseMapper } from "../../infrastructure/mappers/ResumeResponseMapper.js";

import { ResumeResponseDto } from "../dto/ResumeResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DownloadResumeUseCase {

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

        if (

            !resume ||
            !resume.resumeUrl

        ) {

            throw new ApiError(

                "No generated resume is available to download. Generate one first.",

                HttpStatus.NOT_FOUND

            );

        }

        return ResumeResponseMapper.toDto(

            resume

        );

    }

}
