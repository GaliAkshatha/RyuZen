import { ISkill } from "../interfaces/ISkill.js";

import { SkillLevel } from "../constants/SkillLevel.js";

export class Skill {

    constructor(

        private readonly props: ISkill

    ) {}

    static create(

        props: ISkill

    ): Skill {

        return new Skill(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get name(): string {
        return this.props.name;
    }

    get category(): string | undefined {
        return this.props.category;
    }

    get level(): SkillLevel | undefined {
        return this.props.level;
    }

    get verified(): boolean {
        return this.props.verified;
    }

    get source() {
        return this.props.source;
    }

    get confidence(): number | undefined {
        return this.props.confidence;
    }

    get evidence(): string | undefined {
        return this.props.evidence;
    }

    get approved(): boolean {
        return this.props.approved;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<ISkill> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            category?: string;

            level?: SkillLevel;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name =

                values.name;

        }

        if (values.category !== undefined) {

            this.props.category =

                values.category;

        }

        if (values.level !== undefined) {

            this.props.level =

                values.level;

        }

    }

    verify(): void {

        this.props.verified =

            true;

    }

    approve(): void {

        this.props.approved =

            true;

    }

}
