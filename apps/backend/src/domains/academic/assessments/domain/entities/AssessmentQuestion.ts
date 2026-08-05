import { IAssessmentQuestion } from "../interfaces/IAssessmentQuestion.js";

export class AssessmentQuestion {

    constructor(

        private readonly props: IAssessmentQuestion

    ) {}

    static create(

        props: IAssessmentQuestion

    ): AssessmentQuestion {

        return new AssessmentQuestion(props);

    }

    /**
     * Real, deterministic set-equality - a student must select EXACTLY
     * the correct set, no more, no less (a MCQ_MULTIPLE question where
     * the student picks 2 of 3 correct answers and no wrong ones is
     * NOT credited as correct - partial credit isn't implemented here,
     * an honest, simple, and defensible grading rule for a first
     * version rather than a more complex partial-credit scheme).
     */
    isAnsweredCorrectly(

        selectedOptionIndexes: number[]

    ): boolean {

        const correct =
            [...this.props.correctOptionIndexes].sort((a, b) => a - b);

        const selected =
            [...selectedOptionIndexes].sort((a, b) => a - b);

        if (correct.length !== selected.length) {
            return false;
        }

        return correct.every((value, index) => value === selected[index]);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get assessmentId(): string {
        return this.props.assessmentId;
    }

    get questionText(): string {
        return this.props.questionText;
    }

    get type() {
        return this.props.type;
    }

    get options(): string[] {
        return this.props.options;
    }

    get correctOptionIndexes(): number[] {
        return this.props.correctOptionIndexes;
    }

    get marks(): number {
        return this.props.marks;
    }

    get order(): number {
        return this.props.order;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IAssessmentQuestion> {
        return Object.freeze({ ...this.props });
    }

}
