import { INotification } from "../interfaces/INotification.js";

import { NotificationType } from "../constants/NotificationType.js";
import { NotificationAudience } from "../constants/NotificationAudience.js";

export class Notification {

    constructor(

        private readonly props: INotification

    ) {}

    static create(

        props: INotification

    ): Notification {

        return new Notification(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get senderId(): string {
        return this.props.senderId;
    }

    get title(): string {
        return this.props.title;
    }

    get message(): string {
        return this.props.message;
    }

    get type(): NotificationType | undefined {
        return this.props.type;
    }

    get targetAudience(): NotificationAudience {
        return this.props.targetAudience;
    }

    get recipientUserId(): string | undefined {
        return this.props.recipientUserId;
    }

    get departmentIds(): string[] | undefined {
        return this.props.departmentIds;
    }

    get readBy(): string[] {
        return [...this.props.readBy];
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toObject(): Readonly<INotification> {
        return Object.freeze({

            ...this.props,

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
