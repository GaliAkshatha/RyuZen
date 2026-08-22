import type { CredentialRow } from "../types.js";

/**
 * Collected as a plain module-level array (not a class/singleton) -
 * this is a one-shot script, not a long-running service, so the
 * simplest possible shared state is the right tool here.
 */
const rows: CredentialRow[] = [];

export function recordCredential(row: CredentialRow): void {
  rows.push(row);
}

export function getAllCredentials(): CredentialRow[] {
  return rows;
}
