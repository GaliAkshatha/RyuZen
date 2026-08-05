import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";

import { AssessmentResponseMapper } from "../../infrastructure/mappers/AssessmentResponseMapper.js";
import { AssessmentResponseDto } from "../dto/AssessmentResponseDto.js";

export class GetOrganizationAssessmentsUseCase {

    constructor(

        private readonly repository: IAssessmentRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<AssessmentResponseDto[]> {

        const assessments =

            await this.repository.findByOrganization(
                organizationId
            );

        return assessments.map(

            assessment => AssessmentResponseMapper.toDto(assessment)

        );

    }

}
