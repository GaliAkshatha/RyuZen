# RyuZen Seed Data

Creates 3 realistic, fictional organizations with faculty, students, alumni,
placement admins, companies, recruiters, placement drives, activities,
submissions, job applications, connections, and leaderboard entries -
everything needed to exercise every real feature in the app with genuine,
varied data. **Platform Admin (Super Admin) is never touched.**

## Running it

```bash
cd apps/backend
npm run seed
```

This connects using the real `MONGODB_URI` from your `.env` (the same
variable the actual app boots with) and writes a `SEED_CREDENTIALS.md`
file in `apps/backend/` listing every real account it created.

Running it twice will create a second, duplicate set of organizations
(there's no "already seeded" check) - point at an empty database, or a
disposable one, not one you want to keep clean.

## If seeding succeeds but the credentials file write fails

Every seeded account shares one known password (`Seed@1234`), so if data
creation completes but the final credentials-file write fails for any
reason (as happened once during development - a Windows-specific path
bug, since fixed), you don't need to re-run the whole seed and create a
second, duplicate set of organizations. Instead:

```bash
npm run seed:credentials
```

This is read-only - it queries the organizations and users that already
exist and regenerates `SEED_CREDENTIALS.md` from them, creating or
modifying nothing.

## How this was verified, and the one honest limitation

This sandbox's network access does not reach either a real MongoDB
instance (no local `mongod` was installable, and this project's real
Atlas cluster is outside the sandbox's network allowlist) - confirmed
directly rather than assumed, so **this script has not been run against
a live database**.

What was actually done instead:
- Every field in every seed file was checked against the real Mongoose
  model it targets (required fields, defaults, enum values, and which
  ID a reference field actually expects - e.g. `Submission.submittedBy`
  is a **User** id, while `LeaderboardEntry.studentId` and
  `JobApplication.studentId` are **Student document** ids, confirmed by
  reading the real use cases that create each, not assumed to be
  consistent).
- Every file typechecks cleanly against a dedicated `seed/tsconfig.json`
  (the project's main `tsconfig.json` only includes `src/**`, so `seed/`
  would otherwise never be checked at all).
- Every model this script touches was exercised with `new Model(...)`
  using the exact real shapes each seed file passes, then validated with
  Mongoose's own `.validateSync()` - genuine schema validation, just
  without a live connection. All 18 passed.

What this **cannot** catch without a real connection: duplicate-key
violations, and whether a referenced id (department, company, etc.)
genuinely resolves to a real document at write time - the script creates
those referenced documents itself, in dependency order, so this should
hold in practice, but it's not the same as having watched it happen.

## Folder layout

```
seed/
  index.ts                       — orchestrator, runs everything in dependency order
  types.ts                       — shared context types passed between steps
  tsconfig.json                  — dedicated config so this folder is genuinely typechecked
  generateCredentialsFile.ts     — writes the final SEED_CREDENTIALS.md
  config/
    organizations.config.ts      — the 3 organization definitions + shared seed password
  utils/
    connection.ts                — connects/disconnects using the real connectDatabase()
    password.ts                  — hashes using the real BCryptPasswordHasher
    random.ts                    — pick/pickMany/randomInt/chance helpers
    credentialsLog.ts            — collects every created account for the credentials file
  data/
    organizations.ts             — Organization + OrganizationSettings + Org Admin + Departments
    faculty.ts
    students.ts
    alumni.ts                    — mix of real ACTIVE (has account) and INVITED (no account yet)
    placementAdmins.ts
    companies.ts
    recruiters.ts
    drives.ts                    — real eligibilityCriteria (department/batch/semester/CGPA)
    activities.ts                — real department targeting (required) + batch/semester/section
    submissions.ts                — pending / approved (real points) / rejected (real feedback)
    applications.ts               — applied / shortlisted / selected / rejected
    connections.ts                 — accepted connections + pending requests
    leaderboard.ts                 — reuses the real LeaderboardRepository.reRank()
```

## Login

Every account uses the same password, shown in `SEED_CREDENTIALS.md`:
`Seed@1234`
