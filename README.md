# RyuZen — Unified Campus & Career Intelligence Platform

A single connected system for campus life and career readiness — where students build a verifiable record of real work, organizations run their entire campus community, and recruiters discover talent backed by evidence instead of a résumé's word for it.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Domain Model](#domain-model)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)

## Problem Statement

A student's real campus record is scattered across systems that don't talk to each other:

- Activity participation lives in one spreadsheet, attendance in another
- Skills are self-declared on a résumé with nothing behind them
- Placement drives, applications, and interview rounds are tracked manually or not at all
- Faculty have no single view of the students they mentor
- Recruiters can't tell a genuine contributor from a well-formatted résumé
- Organizations have no real-time picture of campus-wide engagement

**Result:** campus activity and career readiness stay disconnected — students can't prove what they've actually done, and the people making decisions (faculty, recruiters, admins) are working from incomplete information.

## Solution

RyuZen connects the full campus-to-career pipeline into one system, with every claim backed by a real, traceable record.

| Stage | What happens |
|---|---|
| Activity | Faculty publish activities; students submit real work and get reviewed |
| Points | Every award is a real, hash-chained ledger entry — not just a number that changes |
| Portfolio | Projects, experience, education, and certifications build a real profile |
| Skills | AI extracts skills from actual evidence (projects, approved activities) — not self-declared |
| Placements | Companies, drives, applications, and interview rounds tracked end-to-end |
| Attendance | Live sessions with rotating verification codes and optional location checks |
| Assessments | Timed MCQ assessments with server-side, tamper-proof scoring |
| Mentorship | Every student has a real assigned faculty mentor, tracked with history |
| AI Layer | Career score, resume review, mock interviews, and recommendations — all grounded in real platform data, never invented |
| Recruiting | Recruiters see only real applicants to their own drives, with real evidence behind every profile |

The goal: by the time a student is job-hunting, their profile isn't a claim — it's a record.

## System Architecture

RyuZen is a two-application system: a React single-page frontend and an Express REST API, sharing no code but communicating over a versioned HTTP API.

```
┌───────────────────────┐        HTTPS / JSON         ┌───────────────────────┐
│   apps/frontend-v2     │ ───────────────────────────▶│     apps/backend       │
│                         │◀─────────────────────────── │                         │
│  React 19 + Vite        │         /api/v1/*             │  Express + TypeScript   │
│  7 role-based portals   │                               │  Clean Architecture     │
└───────────────────────┘                               └────────────┬───────────┘
                                                                       │
                                                            ┌──────────┴──────────┐
                                                            │       MongoDB         │
                                                            │   (Mongoose ODM)       │
                                                            └──────────┬──────────┘
                                                                       │
                                    ┌──────────────────────────────────┼──────────────────────────────────┐
                                    │                                  │                                    │
                           ┌────────┴────────┐               ┌─────────┴─────────┐               ┌─────────┴─────────┐
                           │ Gemini / Ollama   │               │  Object Storage     │               │       SMTP          │
                           │ (AI provider,      │               │  (local disk or     │               │  (invitations,       │
                           │  swappable)          │               │   S3-compatible)    │               │   password reset)    │
                           └───────────────────┘               └───────────────────┘               └───────────────────┘
```

The backend follows **Clean Architecture** per domain — each of the roughly 40 business domains (activities, submissions, placements, assessments, and so on) is internally split into `domain` (entities, business rules), `application` (use cases, DTOs), `infrastructure` (Mongoose models, repositories), and `presentation` (routes, controllers, validators) layers. A use case never imports a Mongoose model directly; it depends on a repository interface, with the concrete implementation injected through a per-domain container.

The frontend is organized around **7 independent role portals** (Student, Faculty, Org Admin, Placement Admin, Recruiter, Alumni, Super Admin), each with its own layout, navigation, and page set, sharing a common domain layer (types, API services, React Query hooks) and a common UI component library.

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety across the entire app |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing across 7 role portals |
| TanStack Query | Server state, caching, and mutations |
| React Hook Form + Zod | Form state and validation |
| GSAP | Landing page animation and scroll effects |
| Radix UI | Accessible primitives (dialog, select, tabs, switch) |
| Axios | HTTP client |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | REST API framework |
| TypeScript | Type-safe backend, compiled with `tsc` |
| Mongoose | MongoDB ODM |
| Zod | Request validation |
| jsonwebtoken | Authentication (access + refresh tokens) |
| bcryptjs | Password hashing |
| Multer | Multipart file uploads |
| @aws-sdk/client-s3 | Optional S3-compatible object storage |
| @google/generative-ai | Gemini AI provider |
| Helmet, express-rate-limit | Security headers and rate limiting |
| Nodemailer | Transactional email (invitations, password reset) |
| node-cron | Scheduled jobs |
| Vitest | Test runner |

### Database & Infrastructure

| Technology | Purpose |
|---|---|
| MongoDB | Primary data store |
| Local disk or S3-compatible storage | Certificate/document uploads (swappable via `STORAGE_PROVIDER`) |
| Google Gemini or Ollama | AI provider (swappable via `AI_PROVIDER` — Ollama runs fully local) |
| Docker + docker-compose | Local multi-service orchestration |

## Project Structure

```
RyuZen/
├── apps/
│   ├── frontend-v2/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── pages/          # Landing page + top-level routed pages
│   │   │   │   └── router/         # Route definitions per portal
│   │   │   ├── domains/            # Shared domain layer: types, services, React Query hooks
│   │   │   ├── portals/            # 7 role-based portals, each with its own layout + pages
│   │   │   │   ├── student/
│   │   │   │   ├── faculty/
│   │   │   │   ├── org-admin/
│   │   │   │   ├── placement-admin/
│   │   │   │   ├── recruiter/
│   │   │   │   ├── alumni/
│   │   │   │   └── super-admin/
│   │   │   ├── shared/             # UI primitives, layout, hooks, API client
│   │   │   └── assets/
│   │   ├── vercel.json
│   │   └── Dockerfile
│   │
│   └── backend/
│       ├── src/
│       │   ├── domains/            # ~40 business domains, Clean Architecture per domain
│       │   │   ├── academic/       # activities, submissions, students, faculty, attendance, assessments, mentorship...
│       │   │   ├── ai/             # career-score, chat, interview, resume-review, recommendations
│       │   │   ├── campus/         # badges, clubs, events, certificates, leaderboard, point-ledger
│       │   │   ├── career/         # portfolio, skills, resume, certifications, experience, education
│       │   │   ├── communication/  # chat, news, notifications
│       │   │   ├── community/      # connections
│       │   │   ├── identity/       # auth, users, permissions
│       │   │   ├── organizations/
│       │   │   ├── placements/     # drives, applications, companies, recruiters, interviews, analytics
│       │   │   └── platform/       # audit, permissions
│       │   ├── shared/             # cross-cutting infra: storage, upload, http, middleware
│       │   ├── config/
│       │   └── app.ts
│       ├── seed/                   # Realistic demo data generation
│       ├── render.yaml
│       └── Dockerfile
│
├── docker-compose.yml
└── .gitignore
```

Each domain under `apps/backend/src/domains/**` follows the same internal shape:

```
<domain>/
├── domain/
│   ├── entities/          # Business objects with real invariants, not anemic data bags
│   ├── constants/         # Enums (status, role, type)
│   └── interfaces/        # The domain's own contract - I<Entity>
├── application/
│   ├── use-cases/         # One class per real action - CreateXUseCase, GetXUseCase...
│   ├── dto/                # Request/response shapes
│   └── container/          # Wires concrete implementations into each use case
├── infrastructure/
│   ├── persistence/        # Mongoose schema + model
│   ├── mappers/             # Document <-> domain entity <-> response DTO
│   └── repositories/        # I<Domain>Repository interface + Mongoose implementation
└── presentation/
    ├── routes/
    ├── controllers/
    └── validators/          # Zod schemas
```

## Domain Model

RyuZen uses MongoDB via Mongoose. There is no single fixed relational schema — each domain owns its own collection(s) and references related documents by ObjectId, resolved through repository methods rather than database-level joins.

The core entities and how they relate:

```
Organization
  └── Department
        ├── Faculty ──mentors──▶ Student
        │                          │
        │                          ├──▶ Submission ──▶ Activity (created by Faculty)
        │                          ├──▶ LeaderboardEntry ◀── PointLedgerEntry (hash-chained)
        │                          ├──▶ UserPortfolio ──▶ PortfolioProject, Experience, Education
        │                          ├──▶ Skill (AI-suggested, evidence-linked)
        │                          ├──▶ Certification (self-reported) / Certificate (platform-issued)
        │                          ├──▶ Resume (ATS score computed from real portfolio completeness)
        │                          ├──▶ AttendanceRecord ──▶ AttendanceSession
        │                          ├──▶ AssessmentAttempt ──▶ Assessment
        │                          └──▶ JobApplication ──▶ PlacementDrive ──▶ Company ◀── Recruiter
        └── Club ──advised by──▶ Faculty, has ──▶ ClubMember (Student)

User (identity/auth root)
  ├── Student / Faculty / Alumni / OrgAdmin / PlacementAdmin / Recruiter / SuperAdmin (role-specific profile)
  └── Permission[] (fine-grained overrides on top of role)
```

Every domain's real Mongoose schema is defined in its own `infrastructure/persistence/*Model.ts` file — there is no single `schema.prisma`-style file to point to, by design, since each domain owns its own persistence concern independently.

## Features

### Authentication & Identity
- Registration, login, JWT access + refresh tokens
- Role-based authorization (7 roles) plus fine-grained permission overrides
- Account suspend/reactivate, admin-initiated unlock, account lockout after repeated failed logins
- Invitation-based onboarding for Faculty, Students, and Recruiters

### Academic Core
- Activity creation, publishing, and submission review with real point awards
- A hash-chained, tamper-evident point ledger — every award/deduction is independently re-verifiable, not just a running total
- Faculty-student mentorship with real assignment history, auto-completing a prior mentorship on reassignment
- Live attendance sessions with rotating verification codes, optional GPS proximity checks, manual override, and a correction request/review workflow
- Timed MCQ assessments with server-side scoring and a strict separation between the faculty-authoring view (with answers) and the student-attempt view (without)

### Career & Portfolio
- Full portfolio builder: projects, achievements, experience, education
- AI-driven skill extraction from real evidence (projects, certifications, approved activities) — every suggested skill carries its source and a confidence score, and requires student approval before counting
- Self-reported certifications (with file upload, faculty verification) and platform-issued certificates (faculty/admin issuing recognition for real activities/events)
- Resume builder with an ATS score computed from actual portfolio completeness
- Codeforces profile linking with real handle verification against the public API

### Campus Life
- Clubs with faculty advisors and admin-managed membership
- Campus events with registration, attendance marking, feedback, and bulk certificate issuance
- A platform-wide badge catalog with faculty/admin awarding

### Placements
- Company and recruiter management
- Placement drives with real eligibility criteria (department, batch, CGPA, semester)
- Application tracking through to interview rounds and outcomes
- Recruiters see only genuine applicants to their own company's drives — enforced server-side, not just hidden in the UI

### AI Layer
- **Career score** — computed from real leaderboard standing, portfolio completeness, and skill verification
- **AI chat assistant** — grounded in the student's own real data
- **Mock interviews** — AI-generated questions per role, with a deterministic (not AI-graded) scoring formula so results can't be talked up by clever prompting
- **Resume review** — real, structured AI feedback
- **Recommendations** — activity and skill suggestions based on actual gaps
- Swappable provider: Google Gemini (cloud) or Ollama (fully local, no API key required)

### Communication & Community
- Direct messaging between connections
- Campus-wide news feed (role-restricted posting)
- Real-time notification targeting by audience (internal roles only — recruiters never receive internal broadcasts)
- Connection requests and a professional network directory

### Administration
- Org-wide analytics dashboard (users, departments, activities, AI usage, department comparison)
- A real, independently-verifiable point ledger audit view
- Audit logs
- Alumni verification workflow

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local install, or a managed instance such as MongoDB Atlas)
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)) — or a local [Ollama](https://ollama.com) install if you'd rather run the AI layer fully offline

### 1. Clone the repository

```bash
git clone https://github.com/GaliAkshatha/RyuZen.git
cd RyuZen
```

### 2. Install dependencies

```bash
cd apps/backend && npm install
cd ../frontend-v2 && npm install
```

### 3. Configure environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend-v2/.env.example apps/frontend-v2/.env
```

Fill in the real values — see [Environment Variables](#environment-variables) below for what each one does.

### 4. Seed demo data (optional, recommended)

```bash
cd apps/backend
npm run seed
```

This creates a full demo organization with realistic students, faculty, activities, submissions, placements, and every other domain populated with connected, evidence-backed data — not random filler. Login credentials for the seeded accounts are written to `apps/backend/SEED_CREDENTIALS.md` (gitignored — regenerate anytime with `npm run seed:credentials`, never commit this file).

### 5. Run the app

```bash
# Terminal 1 - backend
cd apps/backend
npm run dev

# Terminal 2 - frontend
cd apps/frontend-v2
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

### Alternative: Docker Compose

```bash
docker compose up --build
```

Brings up MongoDB, the backend, and the frontend (served via nginx) together. See `docker-compose.yml` for the full service definitions.

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default `5000`) | Server port |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Signs access tokens - use a real random string |
| `JWT_EXPIRES_IN` | No (default `7d`) | Access token lifetime |
| `REFRESH_TOKEN_EXPIRES_IN` | No (default `30d`) | Refresh token lifetime |
| `AI_PROVIDER` | No (default `gemini`) | `gemini` or `ollama` |
| `GEMINI_API_KEY` | If using Gemini | Required for every AI feature when `AI_PROVIDER=gemini` |
| `GEMINI_MODEL` | No (default `gemini-3.5-flash`) | Gemini model name |
| `OLLAMA_BASE_URL` | If using Ollama | Default `http://localhost:11434` |
| `OLLAMA_MODEL` | If using Ollama | Default `qwen3:8b` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_MAX` | No | Rate limiting tuning |
| `CACHE_DEFAULT_TTL_SECONDS` | No | Default cache TTL |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` / `EMAIL_FROM` | No | Transactional email - the app runs fine without these, emails just won't send |
| `FRONTEND_URL` | **Yes** | The real deployed frontend origin(s), comma-separated for multiple - used for CORS and email links |
| `ACCOUNT_LOCK_THRESHOLD` / `ACCOUNT_LOCK_DURATION_MS` | No | Failed-login lockout tuning |
| `STORAGE_PROVIDER` | No (default `local`) | `local` or `s3` - see note below |
| `S3_BUCKET` / `S3_REGION` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_ENDPOINT` / `S3_PUBLIC_URL_BASE` | If using S3 | Any S3-compatible provider (AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO) |

> **Storage note:** `STORAGE_PROVIDER=local` writes uploaded files to local disk - fine for local development, but will not survive a redeploy on a platform with an ephemeral filesystem (most free-tier hosting) unless a persistent volume is attached. Use `STORAGE_PROVIDER=s3` for a real production deployment without one.

### Frontend (`apps/frontend-v2/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | The backend's API base URL, e.g. `http://localhost:5000/api/v1` |

Never commit real `.env` files. Only `.env.example` files (with placeholder values) belong in version control.

## Deployment

RyuZen is set up to deploy as two independent services: the frontend on **Vercel**, the backend on **Render**.

### Backend → Render

1. Push this repository to GitHub.
2. In the Render dashboard, choose **New +** → **Blueprint**, and point it at this repo. Render will detect `render.yaml` automatically.
3. Set the real secret values (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and any others marked `sync: false` in `render.yaml`) in the Render dashboard's Environment tab - never commit real secrets into `render.yaml`.
4. Once deployed, copy the service's public URL - you'll need it for the frontend's `VITE_API_BASE_URL`.

### Frontend → Vercel

1. In the Vercel dashboard, import this repository.
2. Set the project's **Root Directory** to `apps/frontend-v2`.
3. Add the environment variable `VITE_API_BASE_URL`, pointing at your real deployed Render backend URL plus `/api/v1`.
4. Deploy. `vercel.json` (already in `apps/frontend-v2`) handles the SPA rewrite so client-side routes survive a hard refresh.

### After both are live

Update the backend's `FRONTEND_URL` environment variable in the Render dashboard to your real Vercel domain, then redeploy the backend - this is what CORS checks against.

## Testing

```bash
cd apps/backend
npm test
```

Runs the full Vitest suite. Tests focus on real business logic and authorization boundaries - cross-organization isolation, role-based access, and the specific business rules behind features like the point ledger's hash chain and the mentorship reassignment flow - rather than trivial coverage padding.

---

Built by Akshatha Gali
