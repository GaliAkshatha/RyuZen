<p align="center">
  <img src="apps/frontend-v2/public/favicon.svg" alt="RyuZen Logo" width="140" />
</p>

<h1 align="center">RyuZen — Intelligent Student Journey Platform</h1>

<p align="center">
  <strong>One connected ecosystem for a student's entire university journey — from day one to placement, and beyond.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_19%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20Ollama-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Our Solution](#our-solution)
3. [System Architecture](#system-architecture)
4. [How the Journey Connects](#how-the-journey-connects)
5. [AI Layer](#ai-layer)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [Features](#features)
9. [Getting Started](#getting-started)
10. [Environment Variables](#environment-variables)

---

## Problem Statement

A student walks onto campus and, from day one, is on their own to figure out what actually matters.

Academics happen in one place. Clubs and activities happen in another. Projects, certifications, mentorship, and placement preparation are treated as separate things.

Then final year arrives, and students are expected to turn years of disconnected activity into a résumé.

> **Result:** students feel lost and disconnected — treating "doing well academically" and "preparing for placement" as two different jobs, when they were always one.

It's not just students who are in the dark:

- **Organizations** have little visibility into what students are actually doing or building until placement season makes it urgent.
- **Recruiters** are handed a résumé and have to take it on faith — without a verified picture of the person behind it.
- **Faculty** see students through individual academic or mentorship interactions instead of one continuous journey.

---

## Our Solution

**RyuZen connects the student's entire university journey into one system.**

Every meaningful activity can contribute to a larger record of growth — connecting campus participation, academics, skills, portfolio development, and placement readiness.

| Stage | What happens |
|---|---|
| **Academics** | Assessments, attendance, submissions, and mentorship are tracked |
| **Campus Life** | Activities, clubs, events, badges, certificates, and points build participation history |
| **Portfolio** | Projects, experience, education, certifications, and achievements form a career profile |
| **Skills** | Skills can be identified from actual evidence rather than existing only as self-declared claims |
| **Career** | Resume analysis, coding profiles, mock interviews, recommendations, and career scoring support preparation |
| **Placements** | Companies, drives, eligibility, applications, interviews, and outcomes are connected end-to-end |

> **By the time a student is job-hunting, their profile should be a record of what they actually did — not just what they wrote on a résumé.**

---

## System Architecture

RyuZen is organized as a layered platform where **role-based portals** connect to domain-driven backend services, real-time communication, AI providers, and persistent storage.

```mermaid
flowchart TB

    %% ================= USERS =================
    subgraph USERS["USERS · ROLE-BASED ACCESS"]
        direction LR
        ST["👨‍🎓 Student"]
        FA["👩‍🏫 Faculty"]
        OA["🏢 Organization Admin"]
        PA["📊 Placement Admin"]
        RE["💼 Recruiter"]
        AL["🎓 Alumni"]
        SA["⚙️ Super Admin"]
    end

    %% ================= FRONTEND =================
    subgraph FE["FRONTEND · React 19 + TypeScript"]
        direction LR
        PORTAL["Role-Based Portals"]
        ROUTER["React Router"]
        QUERY["TanStack Query"]
        SOCKETC["Socket.IO Client"]

        PORTAL --> ROUTER
        ROUTER --> QUERY
        ROUTER --> SOCKETC
    end

    %% ================= BACKEND =================
    subgraph BE["BACKEND · Node.js + Express + TypeScript"]
        direction TB

        API["REST API<br/>/api/v1"]
        AUTH["Authentication & Authorization<br/>JWT + Role-Based Access"]

        subgraph DOMAINS["DOMAIN MODULES · Business Logic"]
            direction LR
            ID["Identity"]
            AC["Academic"]
            CAMP["Campus"]
            CAR["Career"]
            PLC["Placements"]
            COM["Communication"]
            ORG["Organizations"]
            AI["AI"]
            PLAT["Platform"]
        end

        RT["Socket.IO<br/>Real-Time Communication"]
        AIF["AI Provider Factory"]

        API --> AUTH
        AUTH --> DOMAINS
        API --> RT
        DOMAINS --> AIF
    end

    %% ================= DATA =================
    subgraph DATA["DATA LAYER"]
        direction LR
        DB[("MongoDB<br/>+ Mongoose")]
        FILES["Document Storage<br/>Resumes · Certificates · Files"]
    end

    %% ================= EXTERNAL =================
    subgraph EXT["EXTERNAL SERVICES"]
        direction LR
        GEM["Gemini"]
        OLL["Ollama"]
        MAIL["Email Service"]
        JOBS["Scheduled Jobs"]
    end

    %% ================= FLOW =================
    ST & FA & OA & PA & RE & AL & SA --> PORTAL

    QUERY -->|"HTTPS · REST"| API
    SOCKETC <-->|"WebSocket"| RT

    AIF --> GEM
    AIF --> OLL

    DOMAINS -->|"Repositories / Models"| DB
    CAR --> FILES
    PLC --> FILES
    PLAT --> MAIL
    PLAT --> JOBS

    %% ================= STYLES =================
    classDef user fill:#f4efff,stroke:#7655c7,stroke-width:1.5px,color:#17133b
    classDef frontend fill:#edf6ff,stroke:#3b82c4,stroke-width:1.5px,color:#102a43
    classDef backend fill:#f7f1ff,stroke:#7655c7,stroke-width:1.5px,color:#24143f
    classDef domain fill:#ffffff,stroke:#b49bdd,stroke-width:1px,color:#24143f
    classDef data fill:#eefaf6,stroke:#37a889,stroke-width:1.5px,color:#123b32
    classDef external fill:#fff5f5,stroke:#d97b7b,stroke-width:1.5px,color:#4a2020

    class ST,FA,OA,PA,RE,AL,SA user
    class PORTAL,ROUTER,QUERY,SOCKETC frontend
    class API,AUTH,RT,AIF backend
    class ID,AC,CAMP,CAR,PLC,COM,ORG,AI,PLAT domain
    class DB,FILES data
    class GEM,OLL,MAIL,JOBS external
```

### Architecture Flow

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS / PORTALS                              │
│ Student · Faculty · Org Admin · Placement · Recruiter · Alumni      │
│                              · Super Admin                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND · React + TypeScript                     │
│       Role-Based Portals · Router · TanStack Query · Socket.IO      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                     REST / WebSocket
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 BACKEND · Node.js + Express                         │
│                                                                     │
│  API Layer          Authentication & Authorization                  │
│                              │                                      │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐  │
│  │Identity│Academic│ Campus │ Career │Placement│Comm. │   AI   │  │
│  └────────┴────────┴────────┴────────┴────────┴────────┴────────┘  │
│                                                                     │
│             Socket.IO              AI Provider Factory              │
└───────────────┬──────────────────────────┬──────────────────────────┘
                │                          │
                ▼                          ▼
       ┌─────────────────┐        ┌────────────────────┐
       │ MongoDB         │        │ Gemini / Ollama    │
       │ + Mongoose      │        │ AI Providers       │
       └─────────────────┘        └────────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ File Storage    │
       │ Resumes / Certs │
       └─────────────────┘
```

### Key Architectural Decisions

- **Role-based portals** keep each user experience focused on the responsibilities of that role.
- **Domain-based backend modules** keep academic, career, placement, communication, and other business logic separated.
- **REST + Socket.IO** combines reliable resource APIs with real-time communication.
- **AI Provider Factory** keeps AI integration independent from a single model provider.
- **Repository-based persistence** keeps business logic separated from MongoDB/Mongoose.


## How the Journey Connects

RyuZen is built around one core idea:

> **An action should not disappear after it happens.**

For example:

```text
Student participates in an activity
              ↓
        Work is submitted
              ↓
         Faculty reviews
              ↓
       Points / achievement
              ↓
        Evidence is stored
              ↓
       Skills are identified
              ↓
       Career profile grows
              ↓
      AI identifies next steps
              ↓
       Placement readiness
```

The same principle connects academics, campus participation, projects, certifications, coding profiles, mentorship, and placements.

---

## AI Layer

RyuZen uses AI to **interpret the student's journey**, while platform records remain the source of truth.

### AI Provider

```text
              AI Provider
                  │
         ┌────────┴────────┐
         ▼                 ▼
      Gemini             Ollama
      Cloud              Local
```

The provider is configurable, allowing hosted Gemini models or local Ollama models.

### AI Capabilities

- **Career Score** — summarizes career-readiness signals from the platform
- **AI Chat** — provides assistance using available student context
- **Resume Review** — evaluates the student's career profile
- **Mock Interviews** — generates interview questions and evaluates responses
- **Recommendations** — suggests relevant next steps based on identified gaps
- **Skill Extraction** — identifies skills from evidence such as projects and activities

> **AI interprets the journey. It does not invent the journey.**

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS v4** | Styling |
| **React Router v7** | Role-based routing |
| **TanStack Query** | Server state and caching |
| **React Hook Form + Zod** | Forms and validation |
| **Axios** | HTTP client |
| **GSAP** | Landing-page animation |
| **Radix UI** | Accessible UI primitives |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express** | REST API |
| **TypeScript** | Type-safe backend |
| **Mongoose** | MongoDB ODM |
| **Zod** | Request validation |
| **JWT** | Access + refresh authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File uploads |
| **Socket.IO** | Real-time communication |
| **Helmet + rate limiting** | API security |
| **Nodemailer** | Transactional email |
| **node-cron** | Scheduled jobs |
| **Vitest** | Testing |

### Infrastructure

| Technology | Purpose |
|---|---|
| **MongoDB** | Primary data store |
| **Gemini / Ollama** | Swappable AI providers |
| **Local / S3-compatible storage** | Document and certificate storage |
| **Docker Compose** | Local multi-service setup |

---

## Project Structure

```text
RyuZen/
├── apps/
│   ├── frontend-v2/
│   │   ├── src/
│   │   │   ├── app/              # Pages and routing
│   │   │   ├── domains/          # Shared types, services, hooks
│   │   │   ├── portals/           # Role-based portals
│   │   │   │   ├── student/
│   │   │   │   ├── faculty/
│   │   │   │   ├── org-admin/
│   │   │   │   ├── placement-admin/
│   │   │   │   ├── recruiter/
│   │   │   │   ├── alumni/
│   │   │   │   └── super-admin/
│   │   │   └── shared/             # Shared UI and utilities
│   │   └── public/
│   │
│   └── backend/
│       ├── src/
│       │   ├── domains/            # Business domains
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
│       │   ├── shared/             # Cross-cutting infrastructure
│       │   ├── config/
│       │   └── app.ts
│       └── seed/                   # Demo data
│
├── docker-compose.yml
└── render.yaml
```

Each backend domain follows:

```text
<domain>/
├── domain/          # Entities, rules, interfaces
├── application/     # Use cases, DTOs, containers
├── infrastructure/  # Mongoose, repositories, mappers
└── presentation/    # Routes, controllers, validators
```

---

## Features

### Student Journey

- Unified student dashboard
- Academic and campus activity tracking
- Verified points and achievements
- Portfolio and project management
- Skills and certifications
- Career score and recommendations
- Resume builder and review
- Coding-profile verification
- AI chat and mock interviews

### Academic & Campus

- Activities and submissions
- Faculty review and point awards
- Hash-chained point ledger
- Mentorship
- Attendance with rotating verification codes
- Optional location verification
- Timed MCQ assessments
- Clubs and events
- Badges and certificates
- Leaderboards

### Career & Placements

- Projects, experience, education, and certifications
- Placement drives and eligibility rules
- Company and recruiter management
- Job applications
- Interview rounds and outcomes
- Placement analytics

### Communication

- Direct messaging
- Real-time Socket.IO communication
- Connections and connection requests
- Campus news
- Notifications

### Administration

- Role-based portals
- Fine-grained permissions
- Organization and department dashboards
- Audit logs
- Alumni verification
- Platform analytics

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB
- Gemini API key, or Ollama for local AI

### 1. Clone

```bash
git clone https://github.com/GaliAkshatha/RyuZen.git
cd RyuZen
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cd apps/backend
cp .env.example .env
```

Configure MongoDB, authentication, AI, email, and storage variables.

### 4. Start backend

```bash
cd apps/backend
pnpm dev
```

### 5. Start frontend

```bash
cd apps/frontend-v2
pnpm dev
```

Set the frontend API URL to:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Docker

```bash
docker compose up --build
```

---

## Environment Variables

### Backend

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=
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

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never commit real secrets or API credentials.

---

<p align="center">
  Built by <a href="https://github.com/GaliAkshatha">Akshatha Gali</a>
</p>
