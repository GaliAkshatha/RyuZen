import { MockInterviewSessionRepository } from "../../infrastructure/repositories/MockInterviewSessionRepository.js";

import { StubMockInterviewProvider } from "../../infrastructure/ai/StubMockInterviewProvider.js";

import { StartMockInterviewUseCase } from "../use-cases/StartMockInterviewUseCase.js";
import { AnswerMockInterviewUseCase } from "../use-cases/AnswerMockInterviewUseCase.js";
import { GetMockInterviewUseCase } from "../use-cases/GetMockInterviewUseCase.js";
import { GetMyMockInterviewsUseCase } from "../use-cases/GetMyMockInterviewsUseCase.js";

const mockInterviewSessionRepository = new MockInterviewSessionRepository();

/*
 StubMockInterviewProvider is a placeholder (see
 infrastructure/ai/StubMockInterviewProvider.ts). Swap this
 single binding for a real IMockInterviewProvider implementation
 to go live; no other file in this module needs to change.
*/
const mockInterviewProvider = new StubMockInterviewProvider();

export const mockInterviewContainer = {

    startMockInterview:

        new StartMockInterviewUseCase(

            mockInterviewSessionRepository,

            mockInterviewProvider

        ),

    answerMockInterview:

        new AnswerMockInterviewUseCase(

            mockInterviewSessionRepository,

            mockInterviewProvider

        ),

    getMockInterview:

        new GetMockInterviewUseCase(
            mockInterviewSessionRepository
        ),

    getMyMockInterviews:

        new GetMyMockInterviewsUseCase(
            mockInterviewSessionRepository
        )

};
