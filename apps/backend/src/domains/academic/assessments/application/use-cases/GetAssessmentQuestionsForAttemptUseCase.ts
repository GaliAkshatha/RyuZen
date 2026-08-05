import { IAssessmentQuestionRepository } from "../../infrastructure/repositories/IAssessmentQuestionRepository.js";

import { AssessmentQuestionResponseMapper } from "../../infrastructure/mappers/AssessmentQuestionResponseMapper.js";
import { StudentAssessmentQuestionResponseDto } from "../dto/AssessmentQuestionResponseDto.js";

/** The real student-safe view - always maps through toStudentDto, which structurally cannot include correctOptionIndexes (it's not on the DTO type at all, not just omitted at this call site). */
export class GetAssessmentQuestionsForAttemptUseCase {

    constructor(

        private readonly questionRepository: IAssessmentQuestionRepository

    ) {}

    async execute(

        assessmentId: string

    ): Promise<StudentAssessmentQuestionResponseDto[]> {

        const questions =

            await this.questionRepository.findByAssessment(
                assessmentId
            );

        return questions.map(

            question => AssessmentQuestionResponseMapper.toStudentDto(question)

        );

    }

}
