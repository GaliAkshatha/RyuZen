import { ICertificateRepository } from "../../infrastructure/repositories/ICertificateRepository.js";

import { CertificateResponseMapper } from "../../infrastructure/mappers/CertificateResponseMapper.js";

import { CertificateResponseDto } from "../dto/CertificateResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetStudentCertificatesUseCase {

    constructor(

        private readonly repository: ICertificateRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        studentId: string,

        organizationId: string

    ): Promise<CertificateResponseDto[]> {

        const student =

            await this.studentRepository.findById(
                studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const certificates =

            await this.repository.findByStudent(
                studentId
            );

        return certificates.map(

            certificate =>

                CertificateResponseMapper.toDto(
                    certificate
                )

        );

    }

}
