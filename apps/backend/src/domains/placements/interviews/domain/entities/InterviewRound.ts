import { IInterviewRound } from "../interfaces/IInterviewRound.js";
import { InterviewRoundStatus } from "../constants/InterviewRoundStatus.js";

export class InterviewRound {

    constructor(

        private readonly props: IInterviewRound

    ) {}

    static create(

        props: IInterviewRound

    ): InterviewRound {

        return new InterviewRound(props);

    }

    reschedule(

        scheduledAt: Date,

        interviewerId?: string

    ): void {

        if (

            this.props.status === InterviewRoundStatus.PASSED ||
            this.props.status === InterviewRoundStatus.FAILED

        ) {

            throw new Error(
                "Cannot reschedule a round that has already been completed."
            );

        }

        this.props.scheduledAt = scheduledAt;

        if (interviewerId !== undefined) {

            this.props.interviewerId = interviewerId;

        }

        this.props.status = InterviewRoundStatus.SCHEDULED;

    }

    recordEvaluation(

        passed: boolean,

        evaluation: {
            rating?: number;
            strengths?: string;
            weaknesses?: string;
            notes?: string;
        }

    ): void {

        if (

            this.props.status === InterviewRoundStatus.PASSED ||
            this.props.status === InterviewRoundStatus.FAILED

        ) {

            throw new Error(
                "This round has already been evaluated."
            );

        }

        this.props.evaluation = evaluation;

        this.props.status = passed
            ? InterviewRoundStatus.PASSED
            : InterviewRoundStatus.FAILED;

        this.props.completedAt = new Date();

    }

    cancel(): void {

        this.props.status = InterviewRoundStatus.CANCELLED;

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get applicationId(): string {
        return this.props.applicationId;
    }

    get roundType() {
        return this.props.roundType;
    }

    get sequence(): number {
        return this.props.sequence;
    }

    get scheduledAt(): Date | undefined {
        return this.props.scheduledAt;
    }

    get interviewerId(): string | undefined {
        return this.props.interviewerId;
    }

    get status(): InterviewRoundStatus {
        return this.props.status;
    }

    get evaluation() {
        return this.props.evaluation;
    }

    get completedAt(): Date | undefined {
        return this.props.completedAt;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IInterviewRound> {
        return Object.freeze({ ...this.props });
    }

}
