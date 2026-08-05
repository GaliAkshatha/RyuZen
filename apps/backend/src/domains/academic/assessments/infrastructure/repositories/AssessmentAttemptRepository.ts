import { AssessmentAttempt } from "../../domain/entities/AssessmentAttempt.js";

import { AssessmentAttemptModel } from "../persistence/AssessmentAttemptModel.js";
import { AssessmentAttemptMapper } from "../mappers/AssessmentAttemptMapper.js";

import { IAssessmentAttemptRepository } from "./IAssessmentAttemptRepository.js";

export class AssessmentAttemptRepository implements IAssessmentAttemptRepository {

    async create(attempt: AssessmentAttempt): Promise<AssessmentAttempt> {

        const document = await AssessmentAttemptModel.create(
            AssessmentAttemptMapper.toPersistence(attempt)
        );

        return AssessmentAttemptMapper.toDomain(document);

    }

    async findById(id: string): Promise<AssessmentAttempt | null> {

        const document = await AssessmentAttemptModel.findById(id);

        return document ? AssessmentAttemptMapper.toDomain(document) : null;

    }

    async findByAssessmentAndStudent(

        assessmentId: string,
        studentId: string

    ): Promise<AssessmentAttempt | null> {

        const document = await AssessmentAttemptModel.findOne({ assessmentId, studentId });

        return document ? AssessmentAttemptMapper.toDomain(document) : null;

    }

    async findByStudent(studentId: string): Promise<AssessmentAttempt[]> {

        const documents = await AssessmentAttemptModel.find({ studentId }).sort({ createdAt: -1 });

        return documents.map(document => AssessmentAttemptMapper.toDomain(document));

    }

    async findByAssessment(assessmentId: string): Promise<AssessmentAttempt[]> {

        const documents = await AssessmentAttemptModel.find({ assessmentId }).sort({ createdAt: -1 });

        return documents.map(document => AssessmentAttemptMapper.toDomain(document));

    }

    async save(attempt: AssessmentAttempt): Promise<AssessmentAttempt> {

        const document = await AssessmentAttemptModel.findByIdAndUpdate(

            attempt.id,
            AssessmentAttemptMapper.toPersistence(attempt),
            { new: true, runValidators: true }

        );

        if (!document) {
            throw new Error("Assessment attempt not found.");
        }

        return AssessmentAttemptMapper.toDomain(document);

    }

}
