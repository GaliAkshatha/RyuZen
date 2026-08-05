import { createHash } from "node:crypto";

/**
 * For hashing high-entropy tokens (refresh tokens, invitation tokens,
 * password-reset tokens) - deliberately NOT bcrypt. bcrypt silently
 * truncates its input to 72 bytes before hashing, which is fine for
 * short human-typed passwords but genuinely dangerous for long
 * strings like JWTs: two DIFFERENT tokens that happen to share the
 * same first 72 bytes (common for JWTs signed moments apart with
 * similar claims/headers) would hash to the SAME bcrypt value,
 * producing a false-positive match. Confirmed this by testing
 * session rotation directly - an old, already-rotated-away refresh
 * token was incorrectly accepted as valid because of exactly this.
 *
 * SHA-256 has no such truncation and is the correct tool for hashing
 * an already-random, already-high-entropy value where the goal is
 * "detect an exact match", not "resist brute-forcing a low-entropy
 * secret" (bcrypt's actual purpose, and the right tool for real
 * passwords - see BCryptPasswordHasher.ts, unaffected by this).
 */
export function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}
