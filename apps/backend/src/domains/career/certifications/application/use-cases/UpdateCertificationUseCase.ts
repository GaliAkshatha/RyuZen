import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { UpdateCertificationDto } from "../dto/UpdateCertificationDto.js";
import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateCertificationUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdateCertificationDto

    ): Promise<CertificationResponseDto> {

        const certification =

            await this.repository.findById(
                id
            );

        if (!certification) {

            throw new ApiError(

                "Certification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (certification.userId !== userId) {

            throw new ApiError(

                "You can only update your own certifications.",

                HttpStatus.FORBIDDEN

            );

        }

        certification.updateDetails(dto);

        const updated =

            await this.repository.save(
                certification
            );

        return CertificationResponseMapper.toDto(

            updated

        );

    }

}
