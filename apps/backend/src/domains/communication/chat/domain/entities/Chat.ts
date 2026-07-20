import { IChat } from "../interfaces/IChat.js";

import { ChatType } from "../constants/ChatType.js";

export class Chat {

    constructor(

        private readonly props: IChat

    ) {}

    static create(

        props: IChat

    ): Chat {

        return new Chat(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get participants(): string[] {
        return [...this.props.participants];
    }

    get type(): ChatType {
        return this.props.type;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toObject(): Readonly<IChat> {
        return Object.freeze({

            ...this.props,

            participants: [...this.props.participants]

        });
    }

    hasParticipant(

        userId: string

    ): boolean {

        return this.props.participants.includes(

            userId

        );

    }

    addParticipant(

        userId: string

    ): void {

        if (this.props.type !== ChatType.GROUP) {

            throw new Error(

                "Only group chats can have participants added."

            );

        }

        if (!this.props.participants.includes(userId)) {

            this.props.participants =

                [...this.props.participants, userId];

        }

    }

}
