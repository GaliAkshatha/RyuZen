/**
 * Shared shapes passed between seed steps. Each step returns the real
 * MongoDB documents (or at minimum their ids) it created, so later
 * steps can reference real, valid ObjectIds rather than guessing or
 * re-querying. Mirrors the same "explicit, typed hand-off" pattern
 * the backend's own use-case layer follows.
 */

export interface SeedOrgDefinition {
  name: string;
  code: string;
  departmentNames: string[];
}

export interface SeededDepartment {
  id: string;
  name: string;
  code: string;
}

export interface SeededUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface SeededOrganization {
  id: string;
  name: string;
  code: string;
  orgAdmin: SeededUser;
  departments: SeededDepartment[];
  /** True when this organization already existed from a previous run (matched by its real, unique code) - the orchestrator uses this to skip re-seeding all of its dependent data, not just the organization itself. */
  alreadyExisted: boolean;
}

export interface SeededFaculty {
  facultyId: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  departmentId: string;
}

export interface SeededStudent {
  studentId: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  departmentId: string;
  batch: string;
  semester: number;
  section: string;
}

export interface SeededAlumnus {
  alumniId: string;
  userId?: string;
  name: string;
  email: string;
  password?: string;
}

export interface SeededCompany {
  id: string;
  name: string;
}

export interface SeededRecruiter {
  recruiterId: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  companyId: string;
}

export interface SeededDrive {
  id: string;
  title: string;
  companyId: string;
  status: string;
}

export interface SeededActivity {
  id: string;
  title: string;
  createdBy: string;
  departmentId: string;
  points: number;
}

/** The full, growing context threaded through every seed step for one organization. */
export interface OrgSeedContext {
  org: SeededOrganization;
  faculty: SeededFaculty[];
  students: SeededStudent[];
  alumni: SeededAlumnus[];
  placementAdmin: SeededUser;
  companies: SeededCompany[];
  recruiters: SeededRecruiter[];
  drives: SeededDrive[];
  activities: SeededActivity[];
}

/** One row per real account created, for the final credentials.md. */
export interface CredentialRow {
  organization: string;
  role: string;
  name: string;
  email: string;
  password: string;
}
