import { Assessment } from "../../domain/entities/Assessment.js";
import { AssessmentType } from "../../domain/constants/AssessmentType.js";
import { AssessmentStatus } from "../../domain/constants/AssessmentStatus.js";

import { AssessmentDocument } from "../persistence/AssessmentModel.js";

export class AssessmentMapper {

    static toDomain(document: AssessmentDocument): Assessment {

        return Assessment.create({

            id: document.id,
            organizationId: document.organizationId.toString(),
            title: document.title,
            description: document.description,
            type: document.type as AssessmentType,
            createdBy: document.createdBy.toString(),
            departmentId: document.departmentId?.toString(),
            durationMinutes: document.durationMinutes,
            totalMarks: document.totalMarks,
            passingScore: document.passingScore,
            status: document.status as AssessmentStatus,
            startsAt: document.startsAt,
            endsAt: document.endsAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt

        });

    }

    static toPersistence(assessment: Assessment) {

        const data = assessment.toObject();

        return {
            organizationId: data.organizationId,
            title: data.title,
            description: data.description,
            type: data.type,
            createdBy: data.createdBy,
            departmentId: data.departmentId,
            durationMinutes: data.durationMinutes,
            totalMarks: data.totalMarks,
            passingScore: data.passingScore,
            status: data.status,
            startsAt: data.startsAt,
            endsAt: data.endsAt
        };

    }

}
