export interface ConnectionResponseDto {

    connectionRequestId: string;

    userId: string;

    name: string;

    role: string;

    avatarUrl?: string;

    connectedSince?: Date;

}
