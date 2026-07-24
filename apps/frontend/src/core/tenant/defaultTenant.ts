import type { Tenant } from "@/core/tenant/tenant.types";

/**
 * The single tenant every organization currently resolves to. No
 * branding overrides are set — the app renders its existing default
 * look exactly as it does today. This is the only Tenant that exists
 * right now; adding a second one later means adding another object
 * here (or a real lookup once subdomains exist), not changing any
 * business feature.
 */
export const defaultTenant: Tenant = {
  id: "default",
  slug: "default",
  name: "RyuZen",
  branding: {},
};
