import { IJobApplication } from "../interfaces/IJobApplication.js";

import { JobApplicationStatus } from "../constants/JobApplicationStatus.js";

export class JobApplication {

    constructor(

        private readonly props: IJobApplication

    ) {}

    static create(

        props: IJobApplication

    ): JobApplication {

        return new JobApplication(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get placementId(): string {
        return this.props.placementId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get resume(): string | undefined {
        return this.props.resume;
    }

    get status(): JobApplicationStatus {
        return this.props.status;
    }

    get remarks(): string | undefined {
        return this.props.remarks;
    }

    get appliedAt(): Date {
        return this.props.appliedAt;
    }

    toObject(): Readonly<IJobApplication> {
        return Object.freeze({ ...this.props });
    }

    updateStatus(

        status: JobApplicationStatus,

        remarks?: string

    ): void {

        this.props.status =

            status;

        if (remarks !== undefined) {

            this.props.remarks =

                remarks;

        }

    }

}
