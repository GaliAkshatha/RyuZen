import { ILeaderboardEntry } from "../interfaces/ILeaderboardEntry.js";

export class LeaderboardEntry {

    constructor(

        private readonly props: ILeaderboardEntry

    ) {}

    static create(

        props: ILeaderboardEntry

    ): LeaderboardEntry {

        return new LeaderboardEntry(props);

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

    get activityPoints(): number {
        return this.props.activityPoints;
    }

    get clubPoints(): number {
        return this.props.clubPoints;
    }

    get eventPoints(): number {
        return this.props.eventPoints;
    }

    get placementPoints(): number {
        return this.props.placementPoints;
    }

    get totalPoints(): number {
        return this.props.totalPoints;
    }

    get rank(): number {
        return this.props.rank;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<ILeaderboardEntry> {
        return Object.freeze({ ...this.props });
    }

}
