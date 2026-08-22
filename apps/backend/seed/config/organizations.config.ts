import type { SeedOrgDefinition } from "../types.js";

/**
 * 3 fictional organizations, deliberately not real institutions.
 * Each gets its own departments (real, isolated Department documents)
 * so every downstream entity - Faculty, Students, Activities, drives'
 * eligibilityCriteria - can reference genuine departmentIds scoped to
 * that one organization.
 */
export const ORG_DEFINITIONS: SeedOrgDefinition[] = [
  {
    name: "Rimuru Tempest University",
    code: "RTU",
    departmentNames: ["Computer Science", "Electronics"],
  },
  {
    name: "Brook College of Engineering",
    code: "BCE",
    departmentNames: ["Computer Science", "Mechanical"],
  },
  {
    name: "Nekomamushi Institute of Technology and Management",
    code: "NITM",
    departmentNames: ["Computer Science", "Information Science"],
  },
];

/** Every seeded account uses this same password, stated plainly in credentials.md - a real, valid password matching the backend's own strength rule (uppercase, lowercase, number, special character). */
export const SEED_PASSWORD = "Seed@1234";
