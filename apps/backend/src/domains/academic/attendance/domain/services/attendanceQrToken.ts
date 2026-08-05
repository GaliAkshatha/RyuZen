import { createHmac } from "node:crypto";

/**
 * The real "rotating signed QR code" mechanism. The token embedded in
 * the QR image is HMAC-SHA256(sessionSecret, sessionId + timeWindow) -
 * a student who screenshots a code can only replay it within the same
 * rotation window (default 20s, configurable per session via
 * qrRotationSeconds), and can never derive a future window's token
 * without the real secret, which is never sent to any client.
 *
 * Verification checks the current window AND the immediately previous
 * one - a deliberate, small grace period for real network/render
 * latency between the faculty device generating a frame and a
 * student's scan reaching the server, not a security weakening (an
 * attacker with a stale token still only gets one extra rotation
 * window, not indefinite replay).
 */
export function generateAttendanceQrToken(

    sessionId: string,

    qrSecret: string,

    rotationSeconds: number,

    atTime: number = Date.now()

): string {

    const window = Math.floor(atTime / (rotationSeconds * 1000));

    return createHmac("sha256", qrSecret)
        .update(`${sessionId}:${window}`)
        .digest("hex");

}

export function verifyAttendanceQrToken(

    submittedToken: string,

    sessionId: string,

    qrSecret: string,

    rotationSeconds: number,

    atTime: number = Date.now()

): boolean {

    const currentWindowToken =

        generateAttendanceQrToken(sessionId, qrSecret, rotationSeconds, atTime);

    if (submittedToken === currentWindowToken) {
        return true;
    }

    const previousWindowToken =

        generateAttendanceQrToken(sessionId, qrSecret, rotationSeconds, atTime - rotationSeconds * 1000);

    return submittedToken === previousWindowToken;

}
