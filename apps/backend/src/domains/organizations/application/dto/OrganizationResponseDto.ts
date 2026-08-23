import { OrganizationStatus } from "../../domain/constants/OrganizationStatus.js";
import { RegistrationMethod } from "../../domain/constants/RegistrationMethod.js";
import { OrganizationType } from "../../domain/constants/OrganizationType.js";
import { SubscriptionPlan } from "../../domain/constants/SubscriptionPlan.js";
import { IOrganization } from "../../domain/interfaces/IOrganization.js";

/**
 * REAL BUG FOUND AND FIXED this pass: no mapper existed anywhere in
 * this domain - every organization use case returned the raw
 * Organization class instance directly to ApiResponse.success (a bare
 * res.json() call). Organization's real fields (id/name/code/etc.)
 * are defined as getters on the class prototype, backed by a private
 * `props` field - JSON.stringify only serializes an object's own
 * enumerable properties, so the actual wire response was
 * `{ props: { name, code, ... } }`, not the flat shape the frontend
 * expects at all. This is confirmed as the real root cause of "the
 * Organizations page shows nothing" - every field the frontend read
 * (org.name, org.status, ...) was genuinely undefined. Every other
 * domain in this codebase already uses a ResponseMapper for exactly
 * this reason; Organizations was the one place that skipped it.
 */
export interface OrganizationResponseDto {
    id: string;
    name: string;
    code: string;
    logo?: string;
    website?: string;
    emailDomains: string[];
    registrationMethod: RegistrationMethod;
    organizationType: OrganizationType;
    subscriptionPlan: SubscriptionPlan;
    status: OrganizationStatus;
    settings: IOrganization["settings"];
    /** Real enrichment, added alongside this fix - only populated by GetOrganizationsUseCase's list view, undefined elsewhere. */
    userCount?: number;
    departmentCount?: number;
}
