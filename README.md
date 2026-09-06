# RyuZen — Intelligent Student Journey Platform

A single connected ecosystem that guides a student through their entire university life — discovering opportunities, building real skills and experience, receiving mentorship and AI-powered guidance, getting placed, and staying connected as alumni long after graduation.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [System Architecture](#system-architecture)
- [The Mock Interview Pipeline](#the-mock-interview-pipeline)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Features](#features)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## Problem Statement

A student's real university experience is scattered across systems that don't talk to each other, and most of what gets recorded can't actually be trusted:

| Problem | What actually happens |
|---|---|
| Disconnected records | Activity participation, attendance, and achievements live in separate spreadsheets — or nowhere |
| Unverifiable claims | Skills on a résumé are just typed in — nothing behind them |
| No single view for mentors | Faculty have no real picture of the students they're mentoring |
| Résumé-only recruiting | Recruiters can't tell a genuine contributor from a well-formatted PDF |
| The journey ends at graduation | Alumni lose their connection to the university the moment they leave |

**Result:** campus life and career readiness stay disconnected — students can't prove what they've actually done, and everyone downstream (faculty, recruiters, the students themselves) is working from incomplete, unverifiable information.

## Our Solution

RyuZen connects the full journey into one system, governed by a simple rule: every claim traces back to something real.

| Stage | What happens |
|---|---|
| Arrive | A real student profile, a real assigned faculty mentor from day one |
| Discover | Activities, clubs, events, and placement drives — matched to real eligibility |
| Participate | Real submissions reviewed by faculty; real points on a hash-chained, tamper-evident ledger |
| Build | AI extracts skills from actual evidence — projects, certifications, approved activities — never self-declared |
| Track | A live Career Score, a real leaderboard, a portfolio that builds itself from real work |
| Prepare | AI mock interviews with voice input/output and adaptive difficulty; AI resume review; real timed assessments |
| Get placed | Companies, drives, applications, interview rounds — recruiters see only genuine applicants |
| Stay connected | An alumni ecosystem — graduates mentor current students and remain part of the community |

## System Architecture

Two independent applications, communicating over a versioned REST API, sharing no code:

```
React 19 + Vite frontend  ──HTTPS/JSON──▶  Express + TypeScript backend  ──▶  MongoDB
   (7 role portals)           /api/v1/*      (~45 domains, Clean Architecture)
```

The backend is a **TypeScript-based modular monolith** — one deployable service, internally organized as strictly bounded, independent domain modules. Every domain follows the same real four-layer shape:

```
<domain>/
├── domain/            # Entities with real business rules, enums, interfaces
├── application/        # Use cases (one class per real action), DTOs, a container wiring it together
├── infrastructure/       # Mongoose schema/model, repository implementation, mappers
└── presentation/          # Routes, controllers, Zod validators
```

A use case never imports a Mongoose model directly — it depends on a repository interface, injected through a per-domain container. That's what lets an AI provider (Gemini or fully local Ollama) or a storage backend (local disk or S3-compatible object storage) be swapped with a single environment variable and zero code changes.

## The Mock Interview Pipeline

The platform's most technically layered feature — an AI mock interview isn't just "ask a question, take an answer." Every stage is real:

```
  Student's Real Evidence
  (portfolio projects + approved skills)
       │
       ▼
  ┌─────────────────────────────────┐
  │  Candidate Context Builder       │
  │  pulls real projects/skills,      │
  │  not a generic role prompt         │
  └───────────────┬───────────────────┘
                  ▼
  ┌─────────────────────────────────┐
  │  AI Question Generation           │
  │  references real project names,    │
  │  tuned to current difficulty        │
  └───────────────┬───────────────────┘
                  ▼
  ┌─────────────────────────────────┐
  │  Student Answers                  │
  │  typed, or spoken (Web Speech API)  │
  └───────────────┬───────────────────┘
                  ▼
  ┌─────────────────────────────────┐
  │  Two Independent Checks           │
  │  ├─ Deterministic length gate       │
  │  │   (can't be gamed by a           │
  │  │    lazy one-liner)                │
  │  └─ Real AI content-quality score    │
  │      (can't be gamed by a long,       │
  │       irrelevant answer either)        │
  └───────────────┬───────────────────┘
                  ▼
  ┌─────────────────────────────────┐
  │  Adaptive Difficulty               │
  │  escalates or eases off in real     │
  │  time based on that quality score    │
  └───────────────┬───────────────────┘
                  ▼
  Hybrid Final Score + Structured Feedback
  { strengths[], improvements[] }
```

The score is never invented by the AI — it's computed from real, stored per-answer assessments, and the model is explicitly told the number and instructed to write feedback consistent with it, not the other way around.

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
| Web Speech API | Voice input/output for AI mock interviews |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | REST API framework |
| TypeScript | Type-safe backend |
| MongoDB + Mongoose | Document database |
| Zod | Request validation |
| jsonwebtoken | JWT authentication (access + refresh tokens) |
| bcryptjs | Password hashing |
| Multer | Multipart file uploads |
| @aws-sdk/client-s3 | Optional S3-compatible object storage |
| @google/generative-ai | Gemini AI provider |
| Helmet, express-rate-limit | Security headers and rate limiting |
| Nodemailer | Transactional email |
| Vitest | Test runner |

## Project Structure

```
RyuZen/
├── apps/
│   ├── frontend-v2/
│   │   └── src/
│   │       ├── app/            # Landing page, top-level routed pages, router
│   │       ├── domains/         # Shared layer: types, API services, React Query hooks
│   │       ├── portals/          # 7 role-based portals (student, faculty, org-admin,
│   │       │                       placement-admin, recruiter, alumni, super-admin)
│   │       └── shared/            # UI primitives, layout, the API client
│   │
│   └── backend/
│       └── src/
│           ├── domains/          # ~45 business domains, Clean Architecture per domain
│           │   ├── academic/     # activities, submissions, students, faculty,
│           │   │                   mentorship, attendance, assessments, alumni
│           │   ├── ai/            # career-score, chat, interview, resume-review,
│           │   │                    recommendations
│           │   ├── campus/         # badges, clubs, events, leaderboard, point-ledger
│           │   ├── career/          # portfolio, skills, resume, certifications
│           │   ├── placements/       # drives, applications, companies, recruiters
│           │   └── platform/          # audit, permissions
│           ├── shared/                 # cross-cutting infra: storage, upload, http
│           └── app.ts
│
└── seed/                                 # Realistic, connected demo data generation
```

## Database Schema

MongoDB via Mongoose — each domain owns its own collection(s), referencing related documents by ObjectId rather than relying on database-level joins. This mirrors the modular monolith's own boundaries: a domain's persistence is genuinely private to it.

```
Organization
  └── Department
        ├── Faculty ──mentors──▶ Student
        │                          │
        │                          ├──▶ Submission ──▶ Activity
        │                          ├──▶ LeaderboardEntry ◀── PointLedgerEntry (hash-chained)
        │                          ├──▶ UserPortfolio ──▶ PortfolioProject, Experience, Education
        │                          ├──▶ Skill (AI-suggested, evidence-linked, student-approved)
        │                          ├──▶ Resume (ATS score from real portfolio completeness)
        │                          ├──▶ AttendanceRecord ──▶ AttendanceSession
        │                          ├──▶ AssessmentAttempt ──▶ Assessment
        │                          ├──▶ MockInterviewSession (voice-enabled, adaptive difficulty)
        │                          ├──▶ ClubMember ──▶ Club ──▶ Event
        │                          └──▶ JobApplication ──▶ PlacementDrive ──▶ Company ◀── Recruiter
        └── Club ──advised by──▶ Faculty

Alumnus ──formerly a──▶ Student, can mentor ──▶ current Student
```

## Features

### Authentication & Identity
Registration, login, JWT access + refresh tokens, role-based authorization plus fine-grained permission overrides, account lockout after repeated failed logins, invitation-based onboarding.

### Academic Core
Activity creation, publishing, and submission review with real point awards on a hash-chained, tamper-evident ledger. Faculty-student mentorship. Live attendance sessions with rotating verification codes and optional GPS checks. Timed assessments with server-side, tamper-proof scoring.

### Career & Portfolio
Full portfolio (projects, experience, education). AI-driven skill extraction from real evidence, requiring student approval before it counts. Faculty-verified certifications and platform-issued certificates. Resume builder with a real ATS score. Codeforces profile linking.

### Campus Life
Clubs — browsable by every student, with a real description, faculty advisor, membership, and a real linked-event activity feed. Campus events with registration, attendance, and certificate issuance. A platform-wide badge catalog.

### Placements
Company and recruiter management, placement drives with real eligibility criteria, application tracking through interview rounds. Recruiters see only genuine applicants to their own company's drives — enforced server-side.

### AI Layer
Career Score computed from real leaderboard standing and portfolio completeness. AI chat grounded in the student's own data. Mock interviews with voice I/O, hybrid scoring, adaptive difficulty, real time pressure, and full history reflected on the portfolio (see the pipeline above). AI resume review. Skill/activity recommendations based on real gaps.

### Communication & Alumni
Direct messaging, a role-restricted campus news feed, audience-scoped notifications, connection requests. An alumni ecosystem — graduates stay connected and mentor current students.

## API Reference

RyuZen's real API spans roughly 45 domains and hundreds of routes — this is a representative sample, not the full surface.

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Login, receive JWT access + refresh tokens |
| POST | `/api/v1/auth/refresh` | Refresh token | Issue a new access token |
| GET | `/api/v1/auth/profile` | JWT | Get the current authenticated user |
| POST | `/api/v1/auth/accept-invitation` | Public | Accept a Faculty/Student/Recruiter invitation |
| POST | `/api/v1/auth/change-password` | JWT | Change the current user's password |

### Academic & Career
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET / POST | `/api/v1/activities` | JWT | List activities / Faculty creates one |
| POST | `/api/v1/submissions/:submissionId/review` | JWT (Faculty) | Approve or reject a submission — awards real ledger points |
| GET | `/api/v1/point-ledger/audit` | JWT (Admin/Faculty) | Independently re-verify the organization's real hash-chained ledger |
| GET / PATCH | `/api/v1/portfolio/me` | JWT | Get or update the current student's own portfolio |
| GET | `/api/v1/skills` | JWT | List a student's AI-suggested and approved skills |
| POST | `/api/v1/resume/generate` | JWT | Generate/update a resume, with a real ATS score |

### Campus Life
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/clubs` | JWT | List all clubs |
| GET | `/api/v1/clubs/:id` | JWT | Real club detail — description, advisor, members |
| GET / POST | `/api/v1/events` | JWT | List events / Faculty creates one |
| POST | `/api/v1/attendance/mark` | JWT (Student) | Mark attendance by scanning the real, current rotating QR token |
| GET / POST | `/api/v1/assessments` | JWT | List assessments / start a timed attempt |

### Placements
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET / POST | `/api/v1/placements` | JWT | List placement drives / create one |
| POST | `/api/v1/applications/:placementId` | JWT (Student) | Apply to a drive — real eligibility enforced server-side |
| GET | `/api/v1/interview-rounds/application/:applicationId` | JWT | Real interview round history for an application |

### AI Layer
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/ai/interview` | JWT (Student) | Start a real mock interview session |
| POST | `/api/v1/ai/interview/:id/answer` | JWT (Student) | Submit an answer — triggers real quality scoring + adaptive difficulty |
| POST | `/api/v1/ai/interview/:id/abandon` | JWT (Student) | End early, scored on whatever was actually answered |
| GET | `/api/v1/ai/interview/candidate/:userId` | JWT | Full interview history for a student |
| POST | `/api/v1/ai/resume-review` | JWT (Student) | Structured AI feedback on a resume |

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local, or a managed instance like MongoDB Atlas)
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)) — or a local [Ollama](https://ollama.com) install to run the AI layer fully offline

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
Fill in real values — see [Environment Variables](#environment-variables).

### 4. Seed demo data (recommended)
```bash
cd apps/backend
npm run seed
```
Creates a full demo organization with realistic, connected data across every domain. Demo credentials are written to `apps/backend/SEED_CREDENTIALS.md` (gitignored).

### 5. Run the app
```bash
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2
cd apps/frontend-v2 && npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser. The backend API runs at [http://localhost:5000/api/v1](http://localhost:5000/api/v1).

## Environment Variables

### Backend (`apps/backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | — | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for signing JWTs |
| `AI_PROVIDER` | `gemini` | `gemini` or `ollama` |
| `GEMINI_API_KEY` | — | Required for every AI feature when using Gemini |
| `GEMINI_MODEL` | `gemini-3.5-flash` | Gemini model name |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Only used when `AI_PROVIDER=ollama` |
| `STORAGE_PROVIDER` | `local` | `local` or `s3` |
| `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | — | Only used when `STORAGE_PROVIDER=s3` |
| `FRONTEND_URL` | `http://localhost:5173` | Real frontend origin(s) — used for CORS and email links |

### Frontend (`apps/frontend-v2/.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | Backend API base URL |

---

Built by Akshatha Gali