import { IAIChat } from "../interfaces/IAIChat.js";

import { IAIChatMessage } from "../interfaces/IAIChatMessage.js";

import { AIChatRole } from "../constants/AIChatRole.js";

export class AIChat {

    constructor(

        private readonly props: IAIChat

    ) {}

    static create(

        props: IAIChat

    ): AIChat {

        return new AIChat(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get messages(): IAIChatMessage[] {
        return [...this.props.messages];
    }

    get context(): string | undefined {
        return this.props.context;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toObject(): Readonly<IAIChat> {
        return Object.freeze({

            ...this.props,

            messages: [...this.props.messages]

        });
    }

    addMessage(

        role: AIChatRole,

        content: string

    ): void {

        this.props.messages =

            [

                ...this.props.messages,

                {

                    role,

                    content,

                    timestamp:
                        new Date()

                }

            ];

    }

}
