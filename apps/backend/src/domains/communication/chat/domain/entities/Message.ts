import { IMessage } from "../interfaces/IMessage.js";

export class Message {

    constructor(

        private readonly props: IMessage

    ) {}

    static create(

        props: IMessage

    ): Message {

        return new Message(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get chatId(): string {
        return this.props.chatId;
    }

    get senderId(): string {
        return this.props.senderId;
    }

    get message(): string {
        return this.props.message;
    }

    get attachments(): string[] {
        return [...this.props.attachments];
    }

    get readBy(): string[] {
        return [...this.props.readBy];
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toObject(): Readonly<IMessage> {
        return Object.freeze({

            ...this.props,

            attachments: [...this.props.attachments],

            readBy: [...this.props.readBy]

        });
    }

    isReadBy(

        userId: string

    ): boolean {

        return this.props.readBy.includes(

            userId

        );

    }

    markReadBy(

        userId: string

    ): void {

        if (!this.props.readBy.includes(userId)) {

            this.props.readBy =

                [...this.props.readBy, userId];

        }

    }

}
