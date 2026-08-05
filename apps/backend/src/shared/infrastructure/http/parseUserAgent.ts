/**
 * Deliberately simple, best-effort parsing of a real User-Agent
 * header - not a full device-detection library (no new dependency
 * for a bounded need: two human-readable labels for a session list,
 * not billing/analytics-grade device fingerprinting). Never invents a
 * value it can't detect; falls back to "Unknown" rather than guessing.
 */
export function parseUserAgent(userAgent: string | undefined): { device: string; browser: string } {

    if (!userAgent) {
        return { device: "Unknown", browser: "Unknown" };
    }

    const ua = userAgent.toLowerCase();

    let device = "Desktop";
    if (/mobile|iphone|android.*mobile/.test(ua)) {
        device = "Mobile";
    } else if (/ipad|tablet|android(?!.*mobile)/.test(ua)) {
        device = "Tablet";
    }

    let browser = "Unknown";
    if (ua.includes("edg/")) {
        browser = "Edge";
    } else if (ua.includes("chrome/") && !ua.includes("chromium")) {
        browser = "Chrome";
    } else if (ua.includes("firefox/")) {
        browser = "Firefox";
    } else if (ua.includes("safari/") && !ua.includes("chrome")) {
        browser = "Safari";
    } else if (ua.includes("opr/") || ua.includes("opera")) {
        browser = "Opera";
    }

    return { device, browser };

}
