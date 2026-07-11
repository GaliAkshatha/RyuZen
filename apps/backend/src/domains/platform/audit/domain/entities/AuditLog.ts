import { IAuditLog } from "../interfaces/IAuditLog.js";

export class AuditLog {

    constructor(

        private readonly props: IAuditLog

    ) {}

    static create(

        props: IAuditLog

    ): AuditLog {

        return new AuditLog(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get userId(): string | undefined {
        return this.props.userId;
    }

    get action(): string {
        return this.props.action;
    }

    get entityType(): string | undefined {
        return this.props.entityType;
    }

    get entityId(): string | undefined {
        return this.props.entityId;
    }

    get method(): string {
        return this.props.method;
    }

    get path(): string {
        return this.props.path;
    }

    get statusCode(): number {
        return this.props.statusCode;
    }

    get ipAddress(): string | undefined {
        return this.props.ipAddress;
    }

    get userAgent(): string | undefined {
        return this.props.userAgent;
    }

    get metadata(): Record<string, unknown> | undefined {
        return this.props.metadata
            ? { ...this.props.metadata }
            : undefined;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IAuditLog> {
        return Object.freeze({
            ...this.props,
            metadata: this.props.metadata
                ? { ...this.props.metadata }
                : undefined
        });
    }

}