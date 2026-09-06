import { IMockInterviewProvider } from "../../application/ports/IMockInterviewProvider.js";

import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";

import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

/*
 Placeholder mock interview provider.

 No live language-model credentials exist in this environment.
 Questions are drawn from a small fixed, generic pool (not
 role-specific). The score is a real, deterministic heuristic
 based on how many questions received a non-trivial answer, but
 the feedback narrative is a clearly labelled placeholder.

 To go live: implement IMockInterviewProvider against a real
 provider (for example the Anthropic or OpenAI SDK, reading an
 API key from env.ts) and swap the binding in
 MockInterviewContainer.ts. No other file needs to change, since
 every use case depends only on the IMockInterviewProvider port.
*/
export class StubMockInterviewProvider
implements IMockInterviewProvider {

    private readonly questionPool = [

        "Tell me about yourself and your background.",

        "What are your greatest strengths relevant to this role?",

        "Describe a challenging problem you solved recently.",

        "Why are you interested in this role?",

        "Where do you see yourself in five years?",

        "Describe a time you worked effectively in a team.",

        "How do you handle tight deadlines or pressure?"

    ];

    async nextQuestion(

        role: string,

        previousExchanges: IInterviewExchange[],

        _candidateContext: string

    ): Promise<string> {

        const index =

            previousExchanges.length % this.questionPool.length;

        const question =

            this.questionPool[index]!;

        return role

            ? `[${role}] ${question}`

            : question;

    }

    async generateFeedback(

        role: string,

        exchanges: IInterviewExchange[],

        score: number

    ): Promise<InterviewFeedback> {

        return {

            summary:
                `This is a placeholder review (score: ${score}/100). No live language-model ` +
                `provider is configured yet - configure AI_PROVIDER to get real, ` +
                `content-aware feedback instead of this placeholder.`,

            strengths: [],

            improvements: []

        };

    }

    /**
     * Honest limitation: with no live LLM configured, this can't
     * genuinely assess content quality - it falls back to a length
     * proxy (longer, up to a point, scores higher), which is a real
     * regression from the real providers' actual content assessment.
     * This exists so the feature still functions end-to-end (adaptive
     * difficulty, the hybrid score) when no AI_PROVIDER is configured,
     * not to claim equivalent quality to a real assessment.
     */
    async assessAnswerQuality(

        _question: string,

        answer: string

    ): Promise<number> {

        const length = answer.trim().length;

        return Math.min(100, Math.round((length / 200) * 100));

    }

}
