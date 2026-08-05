import { IMockInterviewProvider } from "../../application/ports/IMockInterviewProvider.js";
import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";
import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { computeInterviewScore, buildQuestionPrompt, buildFeedbackPrompt } from "./interviewPrompts.js";

/*
 Real Ollama-backed mock interview. nextQuestion is genuinely
 role-aware and avoids repeating prior questions. generateFeedback's
 SCORE is deterministic (shared with GeminiMockInterviewProvider via
 interviewPrompts.ts) - only the feedback narrative is AI-generated.
*/

export class OllamaMockInterviewProvider implements IMockInterviewProvider {
    async nextQuestion(
        role: string,
        previousExchanges: IInterviewExchange[]
    ): Promise<string> {
        const prompt = buildQuestionPrompt(role, previousExchanges);
        return OllamaClient.generateText(prompt);
    }

    async generateFeedback(
        role: string,
        exchanges: IInterviewExchange[]
    ): Promise<InterviewFeedback> {
        const score = computeInterviewScore(exchanges);
        const prompt = buildFeedbackPrompt(role, exchanges, score);
        const feedback = await OllamaClient.generateText(prompt);

        return { score, feedback };
    }
}
