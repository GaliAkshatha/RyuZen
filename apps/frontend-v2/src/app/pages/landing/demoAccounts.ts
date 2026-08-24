/**
 * Real, curated seeded accounts (from Rimuru Tempest University, RTU)
 * - confirmed exact email patterns directly against the actual seed
 * scripts (seed/data/faculty.ts, students.ts, recruiters.ts,
 * alumni.ts, placementAdmins.ts, organizations.ts), not guessed.
 * Every account shares the one real seed password every seeded
 * account uses. All 6 real roles except Super Admin - "strategically
 * available, not all," matching the roles a visitor could actually
 * be evaluating this platform as.
 *
 * Alumni specifically: alumni records are seeded with a genuine
 * random mix of ACTIVE (has a real login) and INVITED (no account
 * yet) - the seed script was fixed to always guarantee the *first*
 * alumnus (alumni1@<code>.edu) is ACTIVE, specifically so this
 * hardcoded demo credential is reliable. An already-seeded database
 * from before that fix needs the alumni re-seeded for this to hold.
 */
export type DemoRole = "student" | "faculty" | "alumni" | "organization" | "recruiter" | "placementAdmin";

export interface DemoAccount {
  role: DemoRole;
  label: string;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: Record<DemoRole, DemoAccount> = {
  student: {
    role: "student",
    label: "Student",
    email: "student1@rtu.edu",
    password: "Seed@1234",
  },
  faculty: {
    role: "faculty",
    label: "Faculty",
    email: "faculty1@rtu.edu",
    password: "Seed@1234",
  },
  alumni: {
    role: "alumni",
    label: "Alumni",
    email: "alumni1@rtu.edu",
    password: "Seed@1234",
  },
  organization: {
    role: "organization",
    label: "Organization",
    email: "admin@rtu.edu",
    password: "Seed@1234",
  },
  recruiter: {
    role: "recruiter",
    label: "Recruiter",
    email: "recruiter1@rtu.edu",
    password: "Seed@1234",
  },
  placementAdmin: {
    role: "placementAdmin",
    label: "Placement Admin",
    email: "placement-admin@rtu.edu",
    password: "Seed@1234",
  },
};
