/**
 * The three experiences the product is organized around (see
 * 01_Frontend_Architecture.md's target product model). Corrected from
 * an earlier experiment's `"campus" | "organization" | "platform"`
 * split, which incorrectly gave Organization Admin its own portal
 * separate from Student/Faculty/Alumni — the brief is explicit that
 * all four roles share ONE Organization Application; only
 * permissions, navigation, and dashboard differ within it.
 */
export type PortalId = "public" | "organization" | "platform";

export interface PortalConfig {
  id: PortalId;
  name: string;
  description: string;
}
