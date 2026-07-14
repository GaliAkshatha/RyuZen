import { ICertificateRepository } from "../../infrastructure/repositories/ICertificateRepository.js";

import { CertificateResponseMapper } from "../../infrastructure/mappers/CertificateResponseMapper.js";

import { CertificateResponseDto } from "../dto/CertificateResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetCertificateUseCase {

    constructor(

        private readonly repository: ICertificateRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<CertificateResponseDto> {

        const certificate =

            await this.repository.findById(
                id
            );

        if (!certificate) {

            throw new ApiError(

                "Certificate not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findById(
                certificate.studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Certificate not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return CertificateResponseMapper.toDto(

            certificate

        );

    }

}
