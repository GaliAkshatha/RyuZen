import { ActivityStatus } from "../constants/ActivityStatus.js";
import { ActivityVisibility } from "../constants/ActivityVisibility.js";

import { IActivity } from "../interfaces/IActivity.js";
import { IAttachment } from "../interfaces/IAttachment.js";

export class Activity {

    constructor(

        private props: IActivity

    ) {

        this.validateDates();

    }

    static create(

        props: IActivity

    ): Activity {

        return new Activity(props);

    }

    // ===========================
    // Getters
    // ===========================

    get id() {

        return this.props.id;

    }

    get organizationId() {

        return this.props.organizationId;

    }

    get createdBy() {

        return this.props.createdBy;

    }

    get title() {

        return this.props.title;

    }

    get description() {

        return this.props.description;

    }

    get type() {

        return this.props.type;

    }

    get status() {

        return this.props.status;

    }

    get visibility() {

        return this.props.visibility;

    }

    get departmentIds() {

        return this.props.departmentIds;

    }

    get batches() {

        return this.props.batches;

    }

    get semesters() {

        return this.props.semesters;

    }

    get sections() {

        return this.props.sections;

    }

    get points() {

        return this.props.points;

    }

    get penaltyPoints() {

        return this.props.penaltyPoints;

    }

    get startDate() {

        return this.props.startDate;

    }

    get endDate() {

        return this.props.endDate;

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

    get createdAt() {

        return this.props.createdAt;

    }

    get updatedAt() {

        return this.props.updatedAt;

    }

    // ===========================
    // Business Methods
    // ===========================

    publish(): void {

        if (

            this.props.status !==

            ActivityStatus.DRAFT

        ) {

            throw new Error(

                "Only draft activities can be published."

            );

        }

        this.props.status =

            ActivityStatus.PUBLISHED;

    }

    archive(): void {

        this.props.status =

            ActivityStatus.ARCHIVED;

    }

    close(): void {

        this.props.status =

            ActivityStatus.CLOSED;

    }

    updateDetails(

        values: {

            title?: string;

            description?: string;

            visibility?: ActivityVisibility;

            departmentIds?: string[];

            batches?: string[];

            semesters?: number[];

            sections?: string[];

            points?: number;

            penaltyPoints?: number;

            startDate?: Date;

            endDate?: Date;

        }

    ): void {

        if (

            values.title !== undefined

        ) {

            this.props.title =

                values.title;

        }

        if (

            values.description !== undefined

        ) {

            this.props.description =

                values.description;

        }

        if (

            values.visibility !== undefined

        ) {

            this.props.visibility =

                values.visibility;

        }

        if (

            values.departmentIds !== undefined

        ) {

            this.props.departmentIds =

                values.departmentIds;

        }

        if (

            values.batches !== undefined

        ) {

            this.props.batches =

                values.batches;

        }

        if (

            values.semesters !== undefined

        ) {

            this.props.semesters =

                values.semesters;

        }

        if (

            values.sections !== undefined

        ) {

            this.props.sections =

                values.sections;

        }

        if (

            values.points !== undefined

        ) {

            if (

                values.points < 0

            ) {

                throw new Error(

                    "Points cannot be negative."

                );

            }

            this.props.points =

                values.points;

        }

        if (

            values.penaltyPoints !== undefined

        ) {

            if (

                values.penaltyPoints < 0

            ) {

                throw new Error(

                    "Penalty points cannot be negative."

                );

            }

            this.props.penaltyPoints =

                values.penaltyPoints;

        }

        if (

            values.startDate !== undefined

        ) {

            this.props.startDate =

                values.startDate;

        }

        if (

            values.endDate !== undefined

        ) {

            this.props.endDate =

                values.endDate;

        }

        this.validateDates();

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

    // ===========================
    // Validation
    // ===========================

    private validateDates(): void {

        if (

            this.props.endDate <=

            this.props.startDate

        ) {

            throw new Error(

                "End date must be after start date."

            );

        }

    }

    // ===========================
    // Serialization
    // ===========================

    toObject(): Readonly<IActivity> {

        return Object.freeze({

            ...this.props,

            attachments:

                this.props.attachments.map(

                    attachment => ({

                        ...attachment

                    })

                )

        });

    }

}