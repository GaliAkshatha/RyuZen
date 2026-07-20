import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetCertificationUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        id: string

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

        return CertificationResponseMapper.toDto(

            certification

        );

    }

}
