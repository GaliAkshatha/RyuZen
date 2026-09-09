<div align="center">

<img src="./apps/frontend-v2/public/ryuzen.png" alt="RyuZen Logo" width="90"/>

# RyuZen — Intelligent Student Journey Platform

**One connected ecosystem for a student's entire university journey — from day one to placement, and beyond.**

<p>
  <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white" alt="Socket.IO"/>
</p>

</div>

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [System Architecture](#system-architecture)
- [How the Student Journey Connects](#how-the-student-journey-connects)
- [AI Layer](#ai-layer)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Domain Model](#domain-model)
- [Features](#features)
- [API Architecture](#api-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)

---

## Problem Statement

A student walks onto campus and, from day one, is on their own to figure out what actually matters.

Academics happen in one place. Clubs and activities happen in another. Projects, certifications, attendance, mentorship, and skill-building are scattered across different systems. Then, when placement season arrives, students are suddenly expected to turn years of disconnected activity into a convincing résumé.

**"Placement preparation" doesn't start in final year.**

It is the result of everything a student has been doing since the day they entered university.

But most systems never connect those dots.

> **Result:** students feel lost and disconnected — treating "doing well academically" and "preparing for placement" as two different jobs, when they were always one.

It's not just the students who are in the dark:

- **Organizations** have no real visibility into what students are actually doing or building — not until placement season starts and it's suddenly urgent to know
- **Recruiters** are handed a résumé and have to take it on faith — no real, verified picture of the person behind it
- **Faculty** see students through isolated academic or mentorship interactions rather than one continuous journey
- **Placement teams** have to collect information that should have been building naturally throughout the student's university life

The problem is not a lack of data.

The problem is that **the data has no connected story.**

---

## Our Solution

RyuZen turns the university experience into one connected journey.

Instead of treating academics, activities, skills, projects, campus participation, and placements as separate systems, RyuZen lets each part contribute to the student's overall journey.

```text
                         RyuZen
                           │
            ┌──────────────┼──────────────┐
            │              │              │
        ACADEMICS      CAMPUS LIFE     CAREER
            │              │              │
            ▼              ▼              ▼
       Assessments      Clubs          Projects
       Attendance       Events         Experience
       Mentorship       Activities     Skills
       Submissions      Badges         Certifications
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    VERIFIED EVIDENCE
                           │
                           ▼
                  STUDENT JOURNEY
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          AI INSIGHTS   PORTFOLIO    PLACEMENTS
              │            │            │
              └────────────┼────────────┘
                           ▼
                    CAREER READINESS
```

The goal is simple:

> **By the time a student is ready for placement, their profile should tell the story of what they actually did — not just what they wrote on a résumé.**

### The journey

| What happens | What RyuZen connects |
|---|---|
| Student participates | Activity → submission → review |
| Student contributes | Verified points → leaderboard → achievements |
| Student builds | Projects → experience → portfolio |
| Student learns | Skills → evidence → career insights |
| Student participates on campus | Clubs → events → badges → certificates |
| Student develops professionally | Resume → coding profiles → mock interviews |
| Student applies | Eligibility → placement drive → application |
| Student gets evaluated | Interview rounds → outcomes → placement analytics |

This creates a continuous feedback loop:

```text
University Experience
        ↓
Real Activity & Evidence
        ↓
Skills & Portfolio
        ↓
AI-powered Insights
        ↓
Career Preparation
        ↓
Placement
        ↓
Verified Career Record
```

---

## System Architecture

RyuZen is built as two independently deployable applications communicating through a versioned REST API.

```text
┌────────────────────────────────────────────────────────────┐
│                     RyuZen Frontend                        │
│                  React 19 + TypeScript                     │
│                                                            │
│  Student │ Faculty │ Org Admin │ Placement │ Recruiter    │
│  Alumni  │ Super Admin                                      │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           │ HTTPS / JSON
                           │ /api/v1/*
                           ▼
┌────────────────────────────────────────────────────────────┐
│                     RyuZen Backend                         │
│                 Node.js + Express + TypeScript             │
│                                                            │
│              Clean Architecture by Domain                  │
│                                                            │
│  Academic │ Career │ Campus │ AI │ Placements │ Identity   │
│  Communication │ Community │ Organizations │ Platform      │
└───────────────┬─────────────────────┬──────────────────────┘
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌────────────────┐
        │   MongoDB    │      │  AI Providers  │
        │   Mongoose   │      │ Gemini/Ollama  │
        └──────────────┘      └────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
 Object Storage       SMTP / Jobs
```

### Backend Architecture

Each business domain follows Clean Architecture:

```text
┌──────────────────────────┐
│       Presentation       │
│ Routes / Controllers     │
│ Zod Validators           │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│       Application        │
│ Use Cases / DTOs         │
│ Dependency Containers    │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│          Domain          │
│ Entities / Rules         │
│ Interfaces / Constants   │
└────────────┬─────────────┘
             ▲
┌────────────┴─────────────┐
│      Infrastructure      │
│ Mongoose / Repositories  │
│ Storage / External APIs  │
└──────────────────────────┘
```

A use case depends on a repository interface rather than importing a Mongoose model directly. This keeps business logic independent from persistence and makes individual domains easier to evolve and test.

---

## How the Student Journey Connects

The defining idea behind RyuZen is that **one action should not disappear after it happens.**

For example:

```text
Student completes an activity
            │
            ▼
      Submission reviewed
            │
            ▼
       Points awarded
            │
            ├──────────────► Leaderboard
            │
            ├──────────────► Achievement
            │
            └──────────────► Evidence
                                  │
                                  ▼
                            Skill discovered
                                  │
                                  ▼
                            Career profile
                                  │
                                  ▼
                         AI recommendations
                                  │
                                  ▼
                         Placement readiness
```

The same principle applies across academics, campus life, projects, certifications, coding profiles, mentorship, and placement activity.

RyuZen therefore isn't simply a collection of dashboards.

It is a **connected record of progression**.

---

## AI Layer

RyuZen uses AI to interpret the student's journey, while keeping the underlying platform records as the source of truth.

### Provider Architecture

The AI layer uses a provider abstraction so the application can switch between hosted and local models.

```text
                 ┌───────────────────┐
                 │ AI Provider Factory│
                 └─────────┬─────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌──────────────┐          ┌──────────────┐
       │    Gemini    │          │    Ollama    │
       │    Cloud     │          │    Local     │
       └──────────────┘          └──────────────┘
```

### AI capabilities

- **Career Score** — combines platform-backed signals to give students a clearer picture of career readiness
- **AI Chat** — answers questions using available student/platform context
- **Resume Review** — analyzes the student's career profile and provides structured feedback
- **Mock Interviews** — generates role-relevant interview experiences and evaluates responses
- **Recommendations** — identifies areas where the student can improve based on their journey
- **Skill Extraction** — identifies skills from evidence such as projects and approved activities

The important distinction is:

> **AI interprets the journey. It does not invent the journey.**

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and development server |
| Tailwind CSS v4 | Styling |
| React Router v7 | Routing across role-based portals |
| TanStack Query | Server state, caching, and mutations |
| React Hook Form | Form handling |
| Zod | Validation |
| Axios | API communication |
| GSAP | Landing-page animation |
| Radix UI | Accessible UI primitives |
| Lucide React | Icons |
| Socket.IO Client | Real-time communication |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express | REST API |
| TypeScript | Type-safe backend |
| Mongoose | MongoDB ODM |
| Zod | Request validation |
| JWT | Access and refresh-token authentication |
| bcryptjs | Password hashing |
| Multer | File uploads |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Nodemailer | Transactional email |
| node-cron | Scheduled jobs |
| Socket.IO | Real-time messaging and communication |
| Vitest | Testing |

### Database & Infrastructure

| Technology | Purpose |
|---|---|
| MongoDB | Primary database |
| Local / S3-compatible storage | Certificates and documents |
| Gemini / Ollama | Swappable AI providers |
| Docker Compose | Local multi-service orchestration |
| Render | Backend deployment |
| Vercel | Frontend deployment |

---

## Project Structure

```text
RyuZen/
├── apps/
│   ├── frontend-v2/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── pages/
│   │   │   │   └── router/
│   │   │   ├── domains/
│   │   │   ├── portals/
│   │   │   │   ├── student/
│   │   │   │   ├── faculty/
│   │   │   │   ├── org-admin/
│   │   │   │   ├── placement-admin/
│   │   │   │   ├── recruiter/
│   │   │   │   ├── alumni/
│   │   │   │   └── super-admin/
│   │   │   ├── shared/
│   │   │   └── assets/
│   │   └── public/
│   │
│   └── backend/
│       ├── src/
│       │   ├── domains/
│       │   │   ├── academic/
│       │   │   ├── ai/
│       │   │   ├── campus/
│       │   │   ├── career/
│       │   │   ├── communication/
│       │   │   ├── community/
│       │   │   ├── identity/
│       │   │   ├── organizations/
│       │   │   ├── placements/
│       │   │   └── platform/
│       │   ├── shared/
│       │   ├── config/
│       │   └── app.ts
│       ├── seed/
│       ├── Dockerfile
│       └── render.yaml
│
├── docker-compose.yml
├── package.json
└── pnpm-lock.yaml
```

Each backend domain follows the same internal structure:

```text
<domain>/
├── domain/
│   ├── entities/
│   ├── constants/
│   └── interfaces/
│
├── application/
│   ├── use-cases/
│   ├── dto/
│   └── container/
│
├── infrastructure/
│   ├── persistence/
│   ├── mappers/
│   └── repositories/
│
└── presentation/
    ├── routes/
    ├── controllers/
    └── validators/
```

---

## Domain Model

RyuZen uses MongoDB through Mongoose. Each business domain owns its persistence models and communicates with related domains through repository contracts.

```text
Organization
   │
   └── Department
        │
        ├── Faculty
        │     │
        │     └── mentors
        │            │
        │            ▼
        │         Student
        │            │
        │    ┌───────┼────────┬─────────┐
        │    ▼       ▼        ▼         ▼
        │ Activities Portfolio Skills  Attendance
        │    │       │        │         │
        │    ▼       ▼        ▼         ▼
        │ Submissions Projects Evidence Sessions
        │
        └── Clubs / Events
```

The student's career journey connects further:

```text
Student
   │
   ├── Portfolio
   ├── Projects
   ├── Experience
   ├── Education
   ├── Skills
   ├── Certifications
   ├── Achievements
   ├── Coding Profiles
   ├── Resume
   │
   └── Job Application
             │
             ▼
       Placement Drive
             │
       ┌─────┴─────┐
       ▼           ▼
    Company     Recruiter
       │
       ▼
 Interview Rounds
       │
       ▼
    Outcome
```

Identity sits above these domains:

```text
User
 ├── Student
 ├── Faculty
 ├── Alumni
 ├── Org Admin
 ├── Placement Admin
 ├── Recruiter
 └── Super Admin

User
 └── Fine-grained permissions
```

---

## Features

### Student Journey

- Unified student dashboard
- Academic progress
- Activities and submissions
- Verified points
- Leaderboards
- Achievements and badges
- Portfolio
- Projects
- Experience
- Education
- Certifications
- Skills
- Career score
- Resume building
- Coding-profile verification
- AI recommendations
- AI chat
- Mock interviews

### Academic

- Faculty-created activities
- Student submissions
- Submission review
- Point awards
- Hash-chained point ledger
- Faculty-student mentorship
- Mentorship assignment history
- Attendance sessions
- Rotating attendance verification codes
- Optional location verification
- Attendance correction requests
- Timed MCQ assessments
- Server-side assessment scoring

### Campus Life

- Clubs
- Club memberships
- Faculty club advisors
- Campus events
- Event registration
- Event attendance
- Event feedback
- Badges
- Certificates
- Leaderboards
- Campus participation tracking

### Career

- Portfolio management
- Project records
- Experience and education
- Certifications
- Achievements
- Resume builder
- Portfolio/ATS-style scoring
- Coding-profile linking
- Skill extraction from evidence
- Career readiness signals

### Placements

- Company management
- Recruiter management
- Placement drives
- Eligibility rules
- Job applications
- Interview rounds
- Application outcomes
- Placement analytics

### Communication

- Direct messaging
- Real-time communication through Socket.IO
- Connections
- Connection requests
- Campus news
- Notifications
- Role-aware visibility

### AI

- Career score
- AI chat
- Resume review
- Mock interviews
- Personalized recommendations
- Evidence-based skill extraction
- Gemini support
- Ollama/local model support

### Administration

- Role-based portals
- Fine-grained permissions
- Organization dashboards
- Department-level analytics
- Placement analytics
- AI usage analytics
- Audit logs
- Alumni verification
- Permission management

---

## API Architecture

All backend APIs are versioned under:

```text
/api/v1
```

Major API domains include:

```text
/auth
/users
/students
/faculty
/activities
/submissions
/attendance
/assessments
/mentorships
/clubs
/events
/badges
/certificates
/leaderboard
/point-ledger
/portfolio
/projects
/experience
/education
/skills
/certifications
/achievements
/resume
/coding-profiles
/companies
/recruiters
/placements
/applications
/interview-rounds
/ai
/connections
/notifications
/news
/chats
/messages
/dashboard
/audit-logs
```

### Real-time communication

Socket.IO is used alongside the REST API for real-time communication flows such as messaging.

```text
React Client
     │
     │ Socket.IO
     ▼
Socket Layer
     │
     ├── Authentication
     ├── User presence / rooms
     └── Real-time message events
     │
     ▼
Communication Domain
     │
     ▼
MongoDB
```

REST remains the source for normal resource operations, while Socket.IO handles events that benefit from immediate delivery.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB
- Gemini API key, or Ollama for local AI execution

### 1. Clone the repository

```bash
git clone https://github.com/GaliAkshatha/RyuZen.git
cd RyuZen
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure the backend

```bash
cd apps/backend
cp .env.example .env
```

Configure MongoDB, JWT, AI, email, and storage values.

### 4. Start the backend

```bash
cd apps/backend
pnpm dev
```

### 5. Start the frontend

In a separate terminal:

```bash
cd apps/frontend-v2
pnpm dev
```

The frontend should point to the backend API:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Using Docker Compose

The repository also includes Docker Compose configuration:

```bash
docker compose up --build
```

This provides the local multi-service environment for the application.

---

## Environment Variables

### Backend

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/ryuzen

JWT_SECRET=
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=

FRONTEND_URL=http://localhost:5173

STORAGE_PROVIDER=local

S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never commit real secrets, API keys, database credentials, SMTP credentials, or storage credentials.

---

## Deployment

RyuZen is designed as a separately deployable frontend and backend.

### Backend

The repository includes a `render.yaml` deployment configuration for the backend.

Production infrastructure consists of:

```text
Frontend
   │
   ▼
Vercel
   │
   │ HTTPS
   ▼
Backend
   │
   ▼
Render
   │
   ├── MongoDB
   ├── AI Provider
   ├── Object Storage
   └── SMTP
```

### Frontend

The React/Vite frontend can be deployed independently.

Set:

```env
VITE_API_BASE_URL=<production-api-url>/api/v1
```

The frontend and backend can therefore be scaled and deployed independently.

---

## Testing

Backend tests use **Vitest**.

Run:

```bash
cd apps/backend
pnpm test
```

Type checking:

```bash
pnpm type-check
```

The repository also contains seed utilities for creating realistic demo data across students, faculty, organizations, placements, activities, assessments, campus life, portfolios, AI chats, messages, and notifications.

---

<div align="center">

**RyuZen**

*One journey. One connected record. A clearer path from university to career.*

</div>
