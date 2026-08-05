export interface AttendanceQrTokenResponseDto {

    token: string;

    /** How many seconds until this exact token stops being current - lets the frontend re-fetch/regenerate the QR display at the right cadence. */
    expiresInSeconds: number;

}
