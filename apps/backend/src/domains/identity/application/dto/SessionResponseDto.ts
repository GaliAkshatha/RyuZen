export interface SessionResponseDto {

    id: string;

    device: string;

    browser: string;

    ipAddress: string;

    createdAt?: Date;

    lastActiveAt: Date;

    /** True for whichever session made the current request - lets the frontend show "This device" instead of just another row in the list. */
    isCurrent: boolean;

}
