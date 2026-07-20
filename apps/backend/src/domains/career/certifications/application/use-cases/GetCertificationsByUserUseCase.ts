import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

export class GetCertificationsByUserUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        userId: string

    ): Promise<CertificationResponseDto[]> {

        const certifications =

            await this.repository.findByUserId(
                userId
            );

        return certifications.map(

            certification =>

                CertificationResponseMapper.toDto(
                    certification
                )

        );

    }

}
