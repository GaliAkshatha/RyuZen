import { MockInterviewSessionRepository } from "../../infrastructure/repositories/MockInterviewSessionRepository.js";

import { createMockInterviewProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import { StartMockInterviewUseCase } from "../use-cases/StartMockInterviewUseCase.js";
import { AnswerMockInterviewUseCase } from "../use-cases/AnswerMockInterviewUseCase.js";
import { GetMockInterviewUseCase } from "../use-cases/GetMockInterviewUseCase.js";
import { GetMyMockInterviewsUseCase } from "../use-cases/GetMyMockInterviewsUseCase.js";

const mockInterviewSessionRepository = new MockInterviewSessionRepository();

/*
 Real Ollama-backed mock interview (see
 infrastructure/ai/OllamaMockInterviewProvider.ts). Every use case
 depends only on the IMockInterviewProvider port, so this is the only
 line that ever needed to change to go live.
*/
const mockInterviewProvider = createMockInterviewProvider();

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
