export interface INews {

    id?: string;

    organizationId: string;

    authorId: string;

    /** Denormalized at creation time (fetched from the real User record) so the feed never needs a per-item lookup to show who posted. */
    authorName: string;

    authorRole: string;

    title: string;

    content: string;

    createdAt?: Date;

    updatedAt?: Date;

}
