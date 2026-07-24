import { defaultTenant } from "@/core/tenant/defaultTenant";
import type { Tenant } from "@/core/tenant/tenant.types";

/**
 * The real seam for future multi-tenant support. Today this always
 * returns the Default Tenant — deliberately not implementing subdomain
 * resolution yet, per the product's explicit "prepare the
 * architecture, don't implement subdomains" instruction. When that
 * work happens, only this function's body changes (e.g. reading
 * `window.location.hostname`, looking up the tenant by subdomain
 * against the backend); every consumer of `resolveTenant()` stays the
 * same.
 */
export function resolveTenant(): Tenant {
  return defaultTenant;
}
