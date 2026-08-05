import { Assessment } from "../../domain/entities/Assessment.js";
import { AssessmentStatus } from "../../domain/constants/AssessmentStatus.js";

import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { AssessmentResponseMapper } from "../../infrastructure/mappers/AssessmentResponseMapper.js";

import { CreateAssessmentDto } from "../dto/CreateAssessmentDto.js";
import { AssessmentResponseDto } from "../dto/AssessmentResponseDto.js";

export class CreateAssessmentUseCase {

    constructor(

        private readonly repository: IAssessmentRepository

    ) {}

    async execute(

        organizationId: string,

        createdBy: string,

        dto: CreateAssessmentDto

    ): Promise<AssessmentResponseDto> {

        const assessment = Assessment.create({

            organizationId,

            title: dto.title,

            description: dto.description,

            type: dto.type,

            createdBy,

            departmentId: dto.departmentId,

            durationMinutes: dto.durationMinutes,

            // Real - starts at 0, only ever becomes real once PublishAssessmentUseCase computes it from actual questions.
            totalMarks: 0,

            passingScore: dto.passingScore,

            status: AssessmentStatus.DRAFT,

            startsAt: dto.startsAt,

            endsAt: dto.endsAt

        });

        const created = await this.repository.create(assessment);

        return AssessmentResponseMapper.toDto(created);

    }

}
