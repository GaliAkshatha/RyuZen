/**
 * Optional per-tenant overrides. Every field is optional and absent
 * for the Default Tenant today — the app renders from
 * `styles/tokens.css` (the single, WCAG-AA-audited source of truth)
 * exactly as it always has. When a real second organization is
 * onboarded, populating these fields is the intended override seam;
 * nothing else in the app should need to change to support it.
 */
export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  /** CSS custom property overrides, e.g. { "--primary": "222 47% 40%" } — applied over tokens.css's defaults, never replacing them. */
  colorOverrides?: Record<string, string>;
}

export interface Tenant {
  id: string;
  /** Matches the eventual subdomain, e.g. "default", "rvitm", "mit". Not yet used for routing — subdomain resolution is intentionally not implemented (see resolveTenant.ts). */
  slug: string;
  name: string;
  branding: TenantBranding;
}
