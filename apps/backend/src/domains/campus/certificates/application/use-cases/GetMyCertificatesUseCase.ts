import { ICertificateRepository } from "../../infrastructure/repositories/ICertificateRepository.js";

import { CertificateResponseMapper } from "../../infrastructure/mappers/CertificateResponseMapper.js";

import { CertificateResponseDto } from "../dto/CertificateResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyCertificatesUseCase {

    constructor(

        private readonly repository: ICertificateRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        userId: string

    ): Promise<CertificateResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Only students have certificates.",

                HttpStatus.FORBIDDEN

            );

        }

        const certificates =

            await this.repository.findByStudent(
                student.id!
            );

        return certificates.map(

            certificate =>

                CertificateResponseMapper.toDto(
                    certificate
                )

        );

    }

}
