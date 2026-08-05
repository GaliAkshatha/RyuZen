import { IPointLedgerRepository } from "../../infrastructure/repositories/IPointLedgerRepository.js";

import { PointLedgerResponseMapper } from "../../infrastructure/mappers/PointLedgerResponseMapper.js";

import { PointLedgerEntryResponseDto } from "../dto/PointLedgerEntryResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyPointHistoryUseCase {

    constructor(

        private readonly repository: IPointLedgerRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<PointLedgerEntryResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "No student profile is linked to your account yet. Contact your administrator.",

                HttpStatus.FORBIDDEN

            );

        }

        const entries =

            await this.repository.findByStudentId(
                organizationId,
                student.id!
            );

        return entries.map(
            entry => PointLedgerResponseMapper.toDto(entry)
        );

    }

}
