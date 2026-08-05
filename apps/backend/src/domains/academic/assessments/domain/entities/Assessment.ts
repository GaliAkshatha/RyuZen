import { IAssessment } from "../interfaces/IAssessment.js";
import { AssessmentStatus } from "../constants/AssessmentStatus.js";

export class Assessment {

    constructor(

        private readonly props: IAssessment

    ) {}

    static create(

        props: IAssessment

    ): Assessment {

        return new Assessment(props);

    }

    /** totalMarks comes from the caller (PublishAssessmentUseCase computes it as the real sum of every question's marks) - the entity enforces it can only happen from DRAFT, never re-published. */
    publish(

        totalMarks: number

    ): void {

        if (this.props.status !== AssessmentStatus.DRAFT) {

            throw new Error(
                "Only a draft assessment can be published."
            );

        }

        if (totalMarks <= 0) {

            throw new Error(
                "An assessment with no real marked questions cannot be published."
            );

        }

        this.props.totalMarks = totalMarks;

        this.props.status = AssessmentStatus.PUBLISHED;

    }

    close(): void {

        this.props.status = AssessmentStatus.CLOSED;

    }

    /** The real, single source of truth for "can a student start/continue an attempt right now" - checked by StartAssessmentAttemptUseCase, never re-derived elsewhere. */
    isOpenForAttempts(now: Date = new Date()): boolean {

        if (this.props.status !== AssessmentStatus.PUBLISHED) {
            return false;
        }

        if (this.props.startsAt && now < this.props.startsAt) {
            return false;
        }

        if (this.props.endsAt && now > this.props.endsAt) {
            return false;
        }

        return true;

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get type() {
        return this.props.type;
    }

    get createdBy(): string {
        return this.props.createdBy;
    }

    get departmentId(): string | undefined {
        return this.props.departmentId;
    }

    get durationMinutes(): number {
        return this.props.durationMinutes;
    }

    get totalMarks(): number {
        return this.props.totalMarks;
    }

    get passingScore(): number | undefined {
        return this.props.passingScore;
    }

    get status(): AssessmentStatus {
        return this.props.status;
    }

    get startsAt(): Date | undefined {
        return this.props.startsAt;
    }

    get endsAt(): Date | undefined {
        return this.props.endsAt;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IAssessment> {
        return Object.freeze({ ...this.props });
    }

}
