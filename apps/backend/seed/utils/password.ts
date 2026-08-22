import { BCryptPasswordHasher } from "../../src/domains/identity/infrastructure/security/BCryptPasswordHasher.js";

/** Reuses the exact real hasher every login/change-password/reset-password flow uses - seeded accounts hash and verify identically to accounts created through the real app. */
const hasher = new BCryptPasswordHasher();

export async function hashSeedPassword(plain: string): Promise<string> {
  return hasher.hash(plain);
}
