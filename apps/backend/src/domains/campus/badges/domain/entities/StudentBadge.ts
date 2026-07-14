import { IStudentBadge } from "../interfaces/IStudentBadge.js";

export class StudentBadge {

    constructor(

        private readonly props: IStudentBadge

    ) {}

    static create(

        props: IStudentBadge

    ): StudentBadge {

        return new StudentBadge(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get badgeId(): string {
        return this.props.badgeId;
    }

    get awardedBy(): string {
        return this.props.awardedBy;
    }

    get awardedAt(): Date {
        return this.props.awardedAt;
    }

    toObject(): Readonly<IStudentBadge> {
        return Object.freeze({ ...this.props });
    }

}
