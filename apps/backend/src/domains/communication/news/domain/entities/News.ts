import { INews } from "../interfaces/INews.js";

export class News {

    constructor(

        private readonly props: INews

    ) {}

    static create(

        props: INews

    ): News {

        return new News(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get authorId(): string {
        return this.props.authorId;
    }

    get authorName(): string {
        return this.props.authorName;
    }

    get authorRole(): string {
        return this.props.authorRole;
    }

    get title(): string {
        return this.props.title;
    }

    get content(): string {
        return this.props.content;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    toObject(): INews {
        return { ...this.props };
    }

}
