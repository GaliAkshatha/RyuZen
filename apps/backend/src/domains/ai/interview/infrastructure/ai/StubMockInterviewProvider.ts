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

        previousExchanges: IInterviewExchange[]

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

        exchanges: IInterviewExchange[]

    ): Promise<InterviewFeedback> {

        const MIN_ANSWER_LENGTH = 20;

        const substantiveAnswers =

            exchanges.filter(

                exchange =>
                    (exchange.answer?.trim().length ?? 0) >= MIN_ANSWER_LENGTH

            ).length;

        const score =

            exchanges.length > 0

                ? Math.round(

                    (substantiveAnswers / exchanges.length) * 100

                )

                : 0;

        return {

            score,

            feedback:
                "This is a placeholder review. No live language-model " +
                "provider is configured yet; the score above reflects " +
                `how many of your ${exchanges.length} answer(s) were ` +
                "substantive, but this feedback text is not AI-generated."

        };

    }

}
