import { IMockInterviewSession } from "../interfaces/IMockInterviewSession.js";

import { IInterviewExchange } from "../interfaces/IInterviewExchange.js";

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

    get feedback(): string | undefined {
        return this.props.feedback;
    }

    get score(): number | undefined {
        return this.props.score;
    }

    get createdAt() {
        return this.props.createdAt;
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

        question: string

    ): void {

        if (this.props.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new Error(

                "This interview session has already been completed."

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

    complete(

        feedback: string,

        score: number

    ): void {

        this.props.status =

            InterviewSessionStatus.COMPLETED;

        this.props.feedback =

            feedback;

        this.props.score =

            score;

    }

}
