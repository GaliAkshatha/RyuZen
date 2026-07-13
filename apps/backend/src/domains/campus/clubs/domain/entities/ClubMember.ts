import { IClubMember } from "../interfaces/IClubMember.js";

import { ClubMemberStatus } from "../constants/ClubMemberStatus.js";

export class ClubMember {

    constructor(

        private readonly props: IClubMember

    ) {}

    static create(

        props: IClubMember

    ): ClubMember {

        return new ClubMember(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get clubId(): string {
        return this.props.clubId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get role(): IClubMember["role"] {
        return this.props.role;
    }

    get joinedAt(): Date {
        return this.props.joinedAt;
    }

    get status(): ClubMemberStatus {
        return this.props.status;
    }

    toObject(): Readonly<IClubMember> {
        return Object.freeze({ ...this.props });
    }

}
