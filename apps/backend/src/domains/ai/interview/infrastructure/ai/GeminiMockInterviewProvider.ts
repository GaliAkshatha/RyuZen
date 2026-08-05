import { IMockInterviewProvider } from "../../application/ports/IMockInterviewProvider.js";
import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";
import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

import { GeminiClient } from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { computeInterviewScore, buildQuestionPrompt, buildFeedbackPrompt } from "./interviewPrompts.js";

/*
 Real Gemini-backed mock interview - the cloud counterpart to
 OllamaMockInterviewProvider, sharing the same deterministic score
 formula and prompts (interviewPrompts.ts).
*/

export class GeminiMockInterviewProvider implements IMockInterviewProvider {
    async nextQuestion(
        role: string,
        previousExchanges: IInterviewExchange[]
    ): Promise<string> {
        const prompt = buildQuestionPrompt(role, previousExchanges);
        return GeminiClient.generateText(prompt);
    }

    async generateFeedback(
        role: string,
        exchanges: IInterviewExchange[]
    ): Promise<InterviewFeedback> {
        const score = computeInterviewScore(exchanges);
        const prompt = buildFeedbackPrompt(role, exchanges, score);
        const feedback = await GeminiClient.generateText(prompt);

        return { score, feedback };
    }
}
