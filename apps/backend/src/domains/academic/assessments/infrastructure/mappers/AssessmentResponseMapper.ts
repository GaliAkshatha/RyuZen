import { Assessment } from "../../domain/entities/Assessment.js";

import { AssessmentResponseDto } from "../../application/dto/AssessmentResponseDto.js";

export class AssessmentResponseMapper {

    static toDto(assessment: Assessment): AssessmentResponseDto {

        return {
            id: assessment.id!,
            title: assessment.title,
            description: assessment.description,
            type: assessment.type,
            departmentId: assessment.departmentId,
            durationMinutes: assessment.durationMinutes,
            totalMarks: assessment.totalMarks,
            passingScore: assessment.passingScore,
            status: assessment.status,
            startsAt: assessment.startsAt,
            endsAt: assessment.endsAt,
            createdAt: assessment.createdAt
        };

    }

}
