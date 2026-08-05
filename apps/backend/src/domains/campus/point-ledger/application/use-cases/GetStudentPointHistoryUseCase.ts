import { IPointLedgerRepository } from "../../infrastructure/repositories/IPointLedgerRepository.js";

import { PointLedgerResponseMapper } from "../../infrastructure/mappers/PointLedgerResponseMapper.js";

import { PointLedgerEntryResponseDto } from "../dto/PointLedgerEntryResponseDto.js";

export class GetStudentPointHistoryUseCase {

    constructor(

        private readonly repository: IPointLedgerRepository

    ) {}

    async execute(

        organizationId: string,

        studentId: string

    ): Promise<PointLedgerEntryResponseDto[]> {

        const entries =

            await this.repository.findByStudentId(
                organizationId,
                studentId
            );

        return entries.map(
            entry => PointLedgerResponseMapper.toDto(entry)
        );

    }

}
