import { IMockInterviewSession } from "../interfaces/IMockInterviewSession.js";

import { IInterviewExchange, InterviewDifficulty } from "../interfaces/IInterviewExchange.js";

import { InterviewSessionStatus } from "../constants/InterviewSessionStatus.js";

export class MockInterviewSession {

    constructor(

        private readonly props: IMockInterviewSession

    ) {}

    static create(

        props: IMockInterviewSession

    ): MockInterviewSession {

        return new MockInterviewSession(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get role(): string {
        return this.props.role;
    }

    get exchanges(): IInterviewExchange[] {
        return [...this.props.exchanges];
    }

    get status(): InterviewSessionStatus {
        return this.props.status;
    }

    get durationMinutes(): number {
        return this.props.durationMinutes;
    }

    get feedback(): string | undefined {
        return this.props.feedback;
    }

    get strengths(): string[] | undefined {
        return this.props.strengths;
    }

    get improvements(): string[] | undefined {
        return this.props.improvements;
    }

    get score(): number | undefined {
        return this.props.score;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    /**
     * The real, backend-enforced time limit check - not just a
     * frontend countdown for show. Compared against the session's
     * real createdAt timestamp, since a session's total elapsed time
     * (not time-per-question) is what a real interview's time
     * pressure is actually about.
     */
    isExpired(): boolean {

        if (!this.props.createdAt) {
            return false;
        }

        const elapsedMs =
            Date.now() - this.props.createdAt.getTime();

        return elapsedMs >= this.props.durationMinutes * 60 * 1000;

    }

    toObject(): Readonly<IMockInterviewSession> {
        return Object.freeze({

            ...this.props,

            exchanges: [...this.props.exchanges]

        });
    }

    hasUnansweredQuestion(): boolean {

        const last =

            this.props.exchanges[

                this.props.exchanges.length - 1

            ];

        return !!last && last.answer === undefined;

    }

    askQuestion(

        question: string,

        difficulty: InterviewDifficulty = "MEDIUM"

    ): void {

        if (this.props.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new Error(

                "This interview session has already been completed."

            );

        }

        if (this.isExpired()) {

            throw new Error(

                "This interview session's time limit has been reached."

            );

        }

        if (this.hasUnansweredQuestion()) {

            throw new Error(

                "The current question has not been answered yet."

            );

        }

        this.props.exchanges =

            [

                ...this.props.exchanges,

                {

                    question,

                    difficulty,

                    askedAt:
                        new Date()

                }

            ];

    }

    submitAnswer(

        answer: string

    ): void {

        if (this.props.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new Error(

                "This interview session has already been completed."

            );

        }

        if (!this.hasUnansweredQuestion()) {

            throw new Error(

                "There is no open question to answer."

            );

        }

        const exchanges =

            [...this.props.exchanges];

        const lastIndex =

            exchanges.length - 1;

        exchanges[lastIndex] = {

            ...exchanges[lastIndex]!,

            answer,

            answeredAt:
                new Date()

        };

        this.props.exchanges =

            exchanges;

    }

    /**
     * Records the real AI-assessed content quality for the most
     * recently answered exchange. Called right after submitAnswer,
     * before deciding the next question's difficulty - this is what
     * makes adaptive difficulty actually adaptive in real time,
     * rather than only knowable after the whole interview ends.
     */
    recordAnswerQuality(

        qualityScore: number

    ): void {

        const exchanges =
            [...this.props.exchanges];

        const lastIndex =
            exchanges.length - 1;

        if (lastIndex < 0) {
            return;
        }

        exchanges[lastIndex] = {

            ...exchanges[lastIndex]!,

            qualityScore

        };

        this.props.exchanges =
            exchanges;

    }

    /**
     * Real adaptive difficulty: looks at the quality score of
     * whatever answer was just recorded (not a running average of
     * everything - a candidate who stumbles on one question after
     * doing well shouldn't be permanently stuck at HARD, and vice
     * versa - the interview should feel responsive to how they're
     * doing right now). Escalates on a strong answer, eases off on a
     * weak one, holds steady otherwise. Bounded at both ends - never
     * escalates past HARD or eases below EASY.
     */
    nextDifficulty(): InterviewDifficulty {

        const last =
            this.props.exchanges[this.props.exchanges.length - 1];

        const currentDifficulty =
            last?.difficulty ?? "MEDIUM";

        const lastQuality =
            last?.qualityScore;

        if (lastQuality === undefined) {
            return currentDifficulty;
        }

        const order: InterviewDifficulty[] = ["EASY", "MEDIUM", "HARD"];
        const currentIndex = order.indexOf(currentDifficulty);

        if (lastQuality >= 75) {
            return order[Math.min(currentIndex + 1, order.length - 1)]!;
        }

        if (lastQuality < 40) {
            return order[Math.max(currentIndex - 1, 0)]!;
        }

        return currentDifficulty;

    }

    complete(

        feedback: { summary: string; strengths: string[]; improvements: string[] },

        score: number

    ): void {

        this.props.status =

            InterviewSessionStatus.COMPLETED;

        this.props.feedback =

            feedback.summary;

        this.props.strengths =

            feedback.strengths;

        this.props.improvements =

            feedback.improvements;

        this.props.score =

            score;

    }

    /**
     * A real, distinct action from complete() - the candidate chose
     * to stop before finishing all questions or running out of time.
     * Still gets a real score and real feedback on whatever was
     * actually answered (computed the same way complete() does), but
     * the resulting status honestly reflects that this wasn't a
     * natural finish.
     */
    abandon(

        feedback: { summary: string; strengths: string[]; improvements: string[] },

        score: number

    ): void {

        if (this.props.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new Error(

                "This interview session has already been completed."

            );

        }

        this.props.status =

            InterviewSessionStatus.ABANDONED;

        this.props.feedback =

            feedback.summary;

        this.props.strengths =

            feedback.strengths;

        this.props.improvements =

            feedback.improvements;

        this.props.score =

            score;

    }

}
