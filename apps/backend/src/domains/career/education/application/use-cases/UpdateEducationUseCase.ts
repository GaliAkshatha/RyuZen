import { IEducationRepository } from "../../infrastructure/repositories/IEducationRepository.js";

import { EducationResponseMapper } from "../../infrastructure/mappers/EducationResponseMapper.js";

import { UpdateEducationDto } from "../dto/UpdateEducationDto.js";
import { EducationResponseDto } from "../dto/EducationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateEducationUseCase {

    constructor(

        private readonly repository: IEducationRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdateEducationDto

    ): Promise<EducationResponseDto> {

        const education =

            await this.repository.findById(
                id
            );

        if (!education) {

            throw new ApiError(

                "Education not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (education.userId !== userId) {

            throw new ApiError(

                "You can only update your own education entries.",

                HttpStatus.FORBIDDEN

            );

        }

        education.updateDetails(dto);

        const updated =

            await this.repository.save(
                education
            );

        return EducationResponseMapper.toDto(

            updated

        );

    }

}
