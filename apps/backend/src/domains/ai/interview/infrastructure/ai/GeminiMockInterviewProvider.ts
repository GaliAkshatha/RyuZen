import { IMockInterviewProvider } from "../../application/ports/IMockInterviewProvider.js";
import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";
import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

import { GeminiClient } from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { buildQuestionPrompt, buildFeedbackPrompt, buildQualityAssessmentPrompt, parseQualityScore, parseFeedbackResponse } from "./interviewPrompts.js";

/*
 Real Gemini-backed mock interview - the cloud counterpart to
 OllamaMockInterviewProvider, sharing the same deterministic score
 formula and prompts (interviewPrompts.ts).
*/

export class GeminiMockInterviewProvider implements IMockInterviewProvider {
    async nextQuestion(
        role: string,
        previousExchanges: IInterviewExchange[],
        candidateContext: string
    ): Promise<string> {
        const prompt = buildQuestionPrompt(role, previousExchanges, candidateContext);
        return GeminiClient.generateText(prompt);
    }

    async generateFeedback(
        role: string,
        exchanges: IInterviewExchange[],
        score: number
    ): Promise<InterviewFeedback> {
        const prompt = buildFeedbackPrompt(role, exchanges, score);
        const raw = await GeminiClient.generateText(prompt);
        return parseFeedbackResponse(raw);
    }

    async assessAnswerQuality(
        question: string,
        answer: string
    ): Promise<number> {
        const prompt = buildQualityAssessmentPrompt(question, answer);
        const raw = await GeminiClient.generateText(prompt);
        return parseQualityScore(raw);
    }
}
