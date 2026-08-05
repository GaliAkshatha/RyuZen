/** Real, deliberately narrow - a browsable "people" entry never includes email, phone, or any other sensitive field. Just enough to recognize someone and decide whether to connect. */
export interface ConnectableUserResponseDto {

    id: string;

    name: string;

    role: string;

    avatarUrl?: string;

    /** Set only when a real request already exists between the viewer and this person - lets the UI show "Pending" / "Connected" instead of a misleading "Connect" button. */
    connectionStatus?: "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED";

}
