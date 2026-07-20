import { IAchievement } from "../interfaces/IAchievement.js";

import { AchievementLevel } from "../constants/AchievementLevel.js";
import { AchievementStatus } from "../constants/AchievementStatus.js";

export class Achievement {

    constructor(

        private readonly props: IAchievement

    ) {}

    static create(

        props: IAchievement

    ): Achievement {

        return new Achievement(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get facultyId(): string | undefined {
        return this.props.facultyId;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get category(): string | undefined {
        return this.props.category;
    }

    get level(): AchievementLevel | undefined {
        return this.props.level;
    }

    get position(): string | undefined {
        return this.props.position;
    }

    get certificateUrl(): string | undefined {
        return this.props.certificateUrl;
    }

    get proofUrl(): string | undefined {
        return this.props.proofUrl;
    }

    get achievementDate(): Date {
        return this.props.achievementDate;
    }

    get verifiedBy(): string | undefined {
        return this.props.verifiedBy;
    }

    get status(): AchievementStatus {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IAchievement> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            title?: string;

            description?: string;

            category?: string;

            level?: AchievementLevel;

            position?: string;

            certificateUrl?: string;

            proofUrl?: string;

            achievementDate?: Date;

        }

    ): void {

        if (values.title !== undefined) {

            this.props.title =

                values.title;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

        if (values.category !== undefined) {

            this.props.category =

                values.category;

        }

        if (values.level !== undefined) {

            this.props.level =

                values.level;

        }

        if (values.position !== undefined) {

            this.props.position =

                values.position;

        }

        if (values.certificateUrl !== undefined) {

            this.props.certificateUrl =

                values.certificateUrl;

        }

        if (values.proofUrl !== undefined) {

            this.props.proofUrl =

                values.proofUrl;

        }

        if (values.achievementDate !== undefined) {

            this.props.achievementDate =

                values.achievementDate;

        }

    }

    verify(

        verifiedBy: string

    ): void {

        this.props.status =

            AchievementStatus.VERIFIED;

        this.props.verifiedBy =

            verifiedBy;

    }

    reject(

        verifiedBy: string

    ): void {

        this.props.status =

            AchievementStatus.REJECTED;

        this.props.verifiedBy =

            verifiedBy;

    }

}
