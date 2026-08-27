import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real ownership check: only the student who owns this certification
 * can attach a file to it - not any authenticated student, and never
 * cross-organization (an id that resolves to someone else's
 * certification is treated as not found, not forbidden, so a caller
 * can't use the response to probe which ids are real).
 */
export class UploadCertificationFileUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        fileUrl: string

    ): Promise<CertificationResponseDto> {

        const certification =

            await this.repository.findById(
                id
            );

        if (

            !certification ||
            certification.userId !== userId

        ) {

            throw new ApiError(

                "Certification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        certification.setFileUrl(

            fileUrl

        );

        const updated =

            await this.repository.save(
                certification
            );

        return CertificationResponseMapper.toDto(

            updated

        );

    }

}
