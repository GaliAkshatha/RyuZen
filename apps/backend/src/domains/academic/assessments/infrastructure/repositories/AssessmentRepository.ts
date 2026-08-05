import { Assessment } from "../../domain/entities/Assessment.js";

import { AssessmentModel } from "../persistence/AssessmentModel.js";
import { AssessmentMapper } from "../mappers/AssessmentMapper.js";

import { IAssessmentRepository } from "./IAssessmentRepository.js";

export class AssessmentRepository implements IAssessmentRepository {

    async create(assessment: Assessment): Promise<Assessment> {

        const document = await AssessmentModel.create(AssessmentMapper.toPersistence(assessment));

        return AssessmentMapper.toDomain(document);

    }

    async findById(id: string): Promise<Assessment | null> {

        const document = await AssessmentModel.findById(id);

        return document ? AssessmentMapper.toDomain(document) : null;

    }

    async findByOrganization(organizationId: string): Promise<Assessment[]> {

        const documents = await AssessmentModel.find({ organizationId }).sort({ createdAt: -1 });

        return documents.map(document => AssessmentMapper.toDomain(document));

    }

    async save(assessment: Assessment): Promise<Assessment> {

        const document = await AssessmentModel.findByIdAndUpdate(

            assessment.id,
            AssessmentMapper.toPersistence(assessment),
            { new: true, runValidators: true }

        );

        if (!document) {
            throw new Error("Assessment not found.");
        }

        return AssessmentMapper.toDomain(document);

    }

}
