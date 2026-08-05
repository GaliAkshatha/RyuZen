import { ICodingProfile } from "../interfaces/ICodingProfile.js";

export class CodingProfile {

    constructor(

        private readonly props: ICodingProfile

    ) {}

    static create(props: ICodingProfile): CodingProfile {

        return new CodingProfile(props);

    }

    /** Real, structured stats from a real API response - never partially trusted, the caller (SyncCodingProfileUseCase) always provides every field it actually got back. */
    applySyncedStats(

        stats: {
            currentRating?: number;
            maxRating?: number;
            rank?: string;
            problemsSolved?: number;
        }

    ): void {

        this.props.currentRating = stats.currentRating;

        this.props.maxRating = stats.maxRating;

        this.props.rank = stats.rank;

        this.props.problemsSolved = stats.problemsSolved;

        this.props.lastSyncedAt = new Date();

    }

    markVerified(): void {

        this.props.verified = true;

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

    get platform() {
        return this.props.platform;
    }

    get handle(): string {
        return this.props.handle;
    }

    get verified(): boolean {
        return this.props.verified;
    }

    get currentRating(): number | undefined {
        return this.props.currentRating;
    }

    get maxRating(): number | undefined {
        return this.props.maxRating;
    }

    get rank(): string | undefined {
        return this.props.rank;
    }

    get problemsSolved(): number | undefined {
        return this.props.problemsSolved;
    }

    get lastSyncedAt(): Date | undefined {
        return this.props.lastSyncedAt;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<ICodingProfile> {
        return Object.freeze({ ...this.props });
    }

}
