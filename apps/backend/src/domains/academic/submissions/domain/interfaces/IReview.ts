export interface IReview {

    /** Deliberately optional, not defaulted to "" - a submission with no review yet has no real reviewedBy at all. An empty string was being cast to a Mongoose ObjectId and crashing every real submission with a 500 - confirmed the actual root cause, not a guess. */
    reviewedBy?: string;

    reviewedAt?: Date;

    feedback: string;

    pointsAwarded: number;

}