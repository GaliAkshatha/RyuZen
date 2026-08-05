import { IRecruiter } from "../interfaces/IRecruiter.js";
import { RecruiterStatus } from "../constants/RecruiterStatus.js";

export class Recruiter {

    constructor(

        private readonly props: IRecruiter

    ) {}

    static create(

        props: IRecruiter

    ): Recruiter {

        return new Recruiter(props);

    }

    archive(): void {

        this.props.status = RecruiterStatus.ARCHIVED;

    }

    reactivate(): void {

        this.props.status = RecruiterStatus.ACTIVE;

    }

    updateDetails(

        values: {
            jobTitle?: string;
        }

    ): void {

        if (values.jobTitle !== undefined) {

            this.props.jobTitle = values.jobTitle;

        }

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get companyId(): string {
        return this.props.companyId;
    }

    get jobTitle(): string | undefined {
        return this.props.jobTitle;
    }

    get status(): RecruiterStatus {
        return this.props.status;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IRecruiter> {
        return Object.freeze({ ...this.props });
    }

}
