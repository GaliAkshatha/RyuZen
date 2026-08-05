import { AssessmentQuestion } from "../../domain/entities/AssessmentQuestion.js";

import { AssessmentQuestionModel } from "../persistence/AssessmentQuestionModel.js";
import { AssessmentQuestionMapper } from "../mappers/AssessmentQuestionMapper.js";

import { IAssessmentQuestionRepository } from "./IAssessmentQuestionRepository.js";

export class AssessmentQuestionRepository implements IAssessmentQuestionRepository {

    async create(question: AssessmentQuestion): Promise<AssessmentQuestion> {

        const document = await AssessmentQuestionModel.create(
            AssessmentQuestionMapper.toPersistence(question)
        );

        return AssessmentQuestionMapper.toDomain(document);

    }

    async findById(id: string): Promise<AssessmentQuestion | null> {

        const document = await AssessmentQuestionModel.findById(id);

        return document ? AssessmentQuestionMapper.toDomain(document) : null;

    }

    async findByAssessment(assessmentId: string): Promise<AssessmentQuestion[]> {

        const documents = await AssessmentQuestionModel
            .find({ assessmentId })
            .sort({ order: 1 });

        return documents.map(document => AssessmentQuestionMapper.toDomain(document));

    }

}
