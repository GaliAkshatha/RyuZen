import { IAssessmentAttempt, IAssessmentAnswer } from "../interfaces/IAssessmentAttempt.js";
import { AttemptStatus } from "../constants/AttemptStatus.js";

export class AssessmentAttempt {

    constructor(

        private readonly props: IAssessmentAttempt

    ) {}

    static create(

        props: IAssessmentAttempt

    ): AssessmentAttempt {

        return new AssessmentAttempt(props);

    }

    /** Real upsert-by-questionId - answering the same question twice replaces the prior answer rather than appending a duplicate. */
    recordAnswer(

        questionId: string,

        selectedOptionIndexes: number[]

    ): void {

        if (this.props.status !== AttemptStatus.IN_PROGRESS) {

            throw new Error(
                "Cannot record an answer on an attempt that isn't in progress."
            );

        }

        const existingIndex =
            this.props.answers.findIndex(a => a.questionId === questionId);

        const answer: IAssessmentAnswer = { questionId, selectedOptionIndexes };

        if (existingIndex >= 0) {

            this.props.answers[existingIndex] = answer;

        } else {

            this.props.answers.push(answer);

        }

    }

    submit(

        score: number

    ): void {

        if (this.props.status !== AttemptStatus.IN_PROGRESS) {

            throw new Error(
                "This attempt has already been submitted or has expired."
            );

        }

        this.props.score = score;

        this.props.status = AttemptStatus.SUBMITTED;

        this.props.submittedAt = new Date();

    }

    expire(): void {

        if (this.props.status !== AttemptStatus.IN_PROGRESS) {
            return;
        }

        this.props.status = AttemptStatus.EXPIRED;

    }

    /** The real, single source of truth for "has this attempt run out of time" - minutes elapsed since startedAt versus the assessment's real durationMinutes. */
    hasExceededDuration(

        durationMinutes: number,

        now: Date = new Date()

    ): boolean {

        const elapsedMs =
            now.getTime() - this.props.startedAt.getTime();

        return elapsedMs > durationMinutes * 60 * 1000;

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get assessmentId(): string {
        return this.props.assessmentId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get answers(): IAssessmentAnswer[] {
        return this.props.answers;
    }

    get score(): number | undefined {
        return this.props.score;
    }

    get status(): AttemptStatus {
        return this.props.status;
    }

    get startedAt(): Date {
        return this.props.startedAt;
    }

    get submittedAt(): Date | undefined {
        return this.props.submittedAt;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IAssessmentAttempt> {
        return Object.freeze({ ...this.props, answers: [...this.props.answers] });
    }

}
