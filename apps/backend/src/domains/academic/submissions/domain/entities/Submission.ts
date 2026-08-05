import { SubmissionStatus } from "../constants/SubmissionStatus.js";

import { ISubmission } from "../interfaces/ISubmission.js";
import { IReview } from "../interfaces/IReview.js";

import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

export class Submission {

    constructor(

        private props: ISubmission

    ) {
        this.validate();
    }

    static create(

        props: ISubmission

    ): Submission {

        return new Submission(props);

    }
    private validate(): void {

        if (

            this.props.attachments.length === 0

        ) {

            throw new Error(

                "Submission must contain at least one attachment."

            );

        }

    }
    // ===========================
    // Getters
    // ===========================

    get id() {

        return this.props.id;

    }

    get activityId() {

        return this.props.activityId;

    }

    get organizationId() {

        return this.props.organizationId;

    }

    get submittedBy() {

        return this.props.submittedBy;

    }

    get status() {

        return this.props.status;

    }

    get remarks() {

        return this.props.remarks;

    }

    get attachments(): ReadonlyArray<Readonly<IAttachment>> {

        return Object.freeze(

            this.props.attachments.map(

                attachment =>

                    Object.freeze({

                        ...attachment

                    })

            )

        );

    }

    get review(): Readonly<IReview> {

        return Object.freeze({

            ...this.props.review

        });

    }

    get submittedAt() {

        return this.props.submittedAt;

    }

    get createdAt() {

        return this.props.createdAt;

    }

    get updatedAt() {

        return this.props.updatedAt;

    }

    // ===========================
    // Business Methods
    // ===========================

    applyreview(

        reviewedBy: string,

        approved: boolean,

        feedback: string,

        pointsAwarded: number

    ): void {

        if (

            this.props.status !== SubmissionStatus.PENDING &&

            this.props.status !== SubmissionStatus.RESUBMITTED

        ) {

            throw new Error(

                "Submission cannot be reviewed."

            );

        }

        this.props.status =

            SubmissionStatus.UNDER_REVIEW;

        this.props.review = {

            reviewedBy,

            reviewedAt: new Date(),

            feedback,

            pointsAwarded:

                approved

                    ? pointsAwarded

                    : 0

        };

        this.props.status =

            approved

                ? SubmissionStatus.APPROVED

                : SubmissionStatus.REJECTED;

    }

    resubmit(

        attachments: IAttachment[],

        remarks: string

    ): void {

        this.props.attachments =

            attachments;

        this.props.remarks =

            remarks;

        this.props.submittedAt =

            new Date();

        this.props.status =

            SubmissionStatus.RESUBMITTED;

        this.props.review = {

            reviewedBy: undefined,

            reviewedAt: undefined,

            feedback: "",

            pointsAwarded: 0

        };

    }

    addAttachment(

        attachment: IAttachment

    ): void {

        this.props.attachments.push(

            attachment

        );

    }

    removeAttachment(

        url: string

    ): void {

        this.props.attachments =

            this.props.attachments.filter(

                attachment =>

                    attachment.url !== url

            );

    }

    toObject(): Readonly<ISubmission> {

        return Object.freeze({

            ...this.props,

            attachments:

                this.props.attachments.map(

                    attachment => ({

                        ...attachment

                    })

                ),

            review: {

                ...this.props.review

            }

        });

    }

}