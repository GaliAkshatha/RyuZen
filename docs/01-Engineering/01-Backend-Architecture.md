# RyuZen Backend Architecture

**Document Type:** Engineering Architecture Document (EAD)

**Version:** 1.0

**Status:** Approved

**Owner:** Engineering Team

---

# Purpose

This document defines the backend engineering architecture of RyuZen.

Unlike the Product Architecture and System Architecture documents, this document focuses on implementation standards.

Every backend module must follow this architecture.

The objectives are:

- Maintainability
- Scalability
- Consistency
- Reusability
- Testability
- Security
- Long-Term Evolution

This document serves as the engineering guide for every developer contributing to RyuZen.

---

# Engineering Philosophy

The backend should never be designed around frameworks.

Instead, it should be designed around business domains.

Frameworks can change.

Business domains remain.

Every engineering decision should support:

- Continuous Student Growth
- Domain Ownership
- Privacy by Design
- Human-Centered AI
- Progressive Scalability

---

# Backend Architectural Style

RyuZen follows a combination of:

- Domain-Driven Design (DDD)
- Clean Architecture
- Modular Monolith
- Event-Driven Architecture (Progressive)
- Repository Pattern
- Workflow Pattern
- Policy-Based Authorization

This combination allows the platform to grow without requiring architectural rewrites.

---

# Backend Technology Stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT + Refresh Tokens |
| Real-Time | Socket.io |
| Background Jobs | BullMQ |
| Validation | Zod |
| Queue (Future) | Redis |
| Search (Future) | OpenSearch |
| Storage | AWS S3 / Cloudinary |

---

# High-Level Backend Flow

```
Client

↓

API Gateway

↓

Authentication

↓

Authorization

↓

Policy Engine

↓

Validation

↓

Controller

↓

Workflow

↓

Service

↓

Repository

↓

Database

↓

Publish Event

↓

Response Builder

↓

Client
```

Every request follows this lifecycle.

No shortcuts.

---

# Source Structure

```
src/

│

├── config/

├── shared/

├── domains/

│

├── server.ts
```

Only three top-level folders contain business code.

Everything belongs to a domain.

---

# Config Layer

Purpose

Centralize platform configuration.

Structure

config/

```
environment/

database/

server/

socket/

storage/

ai/

security/

```

Responsibilities

- Environment Variables
- Mongo Configuration
- Redis Configuration
- Storage Providers
- AI Providers
- Security Settings

---

# Shared Layer

Purpose

Provide reusable platform infrastructure.

Shared contains no business logic.

```
shared/

api/

auth/

cache/

constants/

database/

errors/

events/

jobs/

logger/

mail/

middleware/

policies/

responses/

storage/

types/

utils/

validators/
```

Shared is imported by domains.

Domains never import each other directly for infrastructure.

---

# Domain Layer

Every business capability belongs to one domain.

```
domains/

identity/

academic/

community/

professional/

career/

growth/

intelligence/

insights/

integration/
```

Each domain owns its business logic.

---

# Standard Module Structure

Every module follows the same structure.

Example

```
activities/

constants/

dto/

events/

helpers/

models/

policies/

repositories/

routes/

services/

validators/

workflows/

controller.ts

index.ts
```

Every module follows this structure.

No exceptions.

---

# Layer Responsibilities

## Routes

Responsibilities

- Register endpoints
- Attach middleware

Must NOT

- Contain business logic

---

## Controllers

Responsibilities

- Receive request
- Invoke workflow
- Return response

Must NOT

- Validate business rules
- Query database
- Execute transactions

---

## Validators

Responsibilities

- Validate request payload
- Validate query parameters
- Validate path parameters

Must NOT

- Execute business logic

---

## Workflows

Responsibilities

Coordinate complete business use cases.

Example

Approve Activity

↓

Award Academic Score

↓

Award Growth Score

↓

Publish Event

↓

Commit Transaction

Workflows coordinate.

They do not implement business rules.

---

## Services

Responsibilities

Implement business logic.

Examples

- Calculate Points
- Validate Deadlines
- Generate Certificates

Services must remain independent from HTTP.

---

## Repositories

Responsibilities

Database access only.

Repositories are the only layer allowed to communicate with MongoDB.

Services never use Mongoose directly.

---

## Models

Responsibilities

Database schema definitions.

Models contain no business logic.

---

## Policies

Responsibilities

Determine whether an action is permitted.

Examples

- CanApproveSubmission
- CanMessageStudent
- CanViewResume

---

## Events

Responsibilities

Publish domain events.

Example

Activity Approved

↓

ActivityApprovedEvent

---

## DTOs

Responsibilities

Define input and output contracts.

DTOs isolate APIs from database models.

---

# Shared Infrastructure

Before implementing any feature, the following shared components must exist.

---

## Response Builder

Provides standardized API responses.

Examples

```
ApiResponse.success()

ApiResponse.created()

ApiResponse.error()

ApiResponse.paginated()
```

All endpoints return identical response structures.

---

## Global Error Handler

All errors are handled centrally.

Controllers never contain repetitive try-catch blocks unless necessary.

Every error extends a common ApiError class.

---

## Logger

Central logging system.

Supports

- Request Logs
- Error Logs
- Audit Logs
- Security Logs

Future

- Winston
- Pino
- Grafana

---

## Configuration

All environment variables are centralized.

No module reads process.env directly.

Configuration is injected through config services.

---

## Policy Engine

Every sensitive request passes through policy evaluation.

Examples

- Recruiter Access
- AI Visibility
- Cross-University Messaging

---

## Event Bus

Every domain event passes through a common event interface.

Example

```
Activity Completed

↓

Event Bus

↓

Notification

↓

Growth

↓

Insights

↓

AI
```

Initially implemented in-process.

Future versions may use Redis or Kafka.

---

# Request Lifecycle

```
HTTP Request

↓

Route

↓

Authentication

↓

Authorization

↓

Policy

↓

Validation

↓

Controller

↓

Workflow

↓

Service

↓

Repository

↓

MongoDB

↓

Event Bus

↓

Response Builder

↓

HTTP Response
```

Every request follows this lifecycle.

---

# Error Lifecycle

```
Repository

↓

Service

↓

Workflow

↓

Controller

↓

Global Error Handler

↓

Response Builder

↓

Client
```

No custom error handling inside business logic.

---

# Event Lifecycle

```
Business Action

↓

Workflow

↓

Publish Event

↓

Subscribers

↓

Notifications

↓

Growth

↓

Insights

↓

AI
```

Domains communicate through events whenever possible.

---

# Coding Standards

Every engineer follows these principles.

Controllers

- Maximum 100 lines
- No business logic

Services

- Single responsibility

Repositories

- Database access only

Workflows

- One business use case

Validators

- Input validation only

Policies

- Authorization only

Events

- Decoupled communication

Models

- Persistence only

---

# Engineering Rules

1. Every feature belongs to exactly one domain.

2. Controllers never contain business logic.

3. Services never communicate directly with MongoDB.

4. Repositories are the only persistence layer.

5. Workflows coordinate business operations.

6. Policies determine permissions.

7. Validators execute before controllers.

8. Events decouple domains.

9. Shared infrastructure contains no business logic.

10. Every module follows the standard folder structure.

11. Every API returns standardized responses.

12. Every new feature aligns with the Product Architecture.

---

# Module Migration Strategy

The legacy backend will be migrated incrementally.

Migration order:

Phase 1

- Shared Infrastructure
- Identity Domain

Phase 2

- Academic Domain
    - Activities
    - Attendance
    - Leaderboards

Phase 3

- Community Domain
    - Communication
    - Connect
    - Notifications

Phase 4

- Professional Domain
    - Projects
    - Portfolio
    - Skills

Phase 5

- Career Domain
    - Recruiters
    - Jobs
    - Mentorship

Phase 6

- Growth Domain
    - Quests
    - Challenges
    - Rewards

Phase 7

- Intelligence Domain
    - AI Mentor
    - Resume AI
    - Project AI

Phase 8

- Insights Domain

Phase 9

- Integration Domain

No new feature should be introduced before the target domain has been migrated to the new architecture.

---

# Long-Term Evolution

The backend architecture is designed so that each domain can eventually become an independent microservice if required.

Until then, RyuZen remains a Modular Monolith.

This minimizes operational complexity while preserving future scalability.

---

# Guiding Statement

> The RyuZen backend is engineered around business domains, shared engineering standards, and progressive scalability. Every module is designed to be maintainable, reusable, privacy-aware, and capable of evolving from a single-university deployment into a global academic ecosystem without requiring architectural rewrites.