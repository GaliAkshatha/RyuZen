# Activities Module Architecture

> **Module:** Activities
>
> **Purpose:** Manage all academic and extracurricular activities across organizations while supporting submissions, approvals, attendance, reporting, and future gamification.

---

# Table of Contents

1. Overview
2. Responsibilities
3. Features
4. Module Architecture
5. Folder Structure
6. Request Lifecycle
7. Layer Responsibilities
8. Database Design
9. Authentication & Authorization
10. Validation Flow
11. Transaction Flow
12. Error Handling
13. Multi-Tenant Architecture
14. Scalability
15. Design Decisions
16. Future Enhancements

---

# 1. Overview

The Activities module is responsible for managing every activity inside an organization.

Examples:

- Workshops
- Assignments
- Hackathons
- Technical Events
- Club Events
- Seminars
- Registration Forms
- Competitions

Students interact with activities by submitting forms, assignments, or attendance.

Faculty and administrators manage the lifecycle of activities.

---

# 2. Responsibilities

The Activities module is responsible for:

- Creating activities
- Updating activities
- Publishing activities
- Closing activities
- Soft deleting activities
- Student submissions
- Faculty approvals
- Rejections
- Attendance
- CSV export
- Academic point allocation

It is **NOT** responsible for:

- Authentication
- User management
- Notifications (only triggers them)
- AI
- Gamification
- Leaderboards

Those belong to their own modules.

---

# 3. Features

Current MVP

- Create Activity
- Update Activity
- Publish Activity
- Close Activity
- Delete Activity (Soft Delete)
- Submit Activity
- Approve Submission
- Reject Submission
- Mark Attendance
- Export CSV

Future

- Certificates
- AI Evaluation
- AI Feedback
- QR Attendance
- Face Recognition Attendance
- Calendar Integration
- Analytics
- Reward Engine

---

# 4. Module Architecture

The module follows a layered architecture.

```
Client
    │
    ▼
Routes
    │
    ▼
Authentication Middleware
    │
    ▼
Authorization Middleware
    │
    ▼
Validators
    │
    ▼
Validate Middleware
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Workflows
    │
    ▼
Helpers
    │
    ▼
Models (MongoDB)
```

Each layer has a single responsibility.

---

# 5. Folder Structure

```
activities/

├── constants/
│
├── models/
│
├── validators/
│
├── helpers/
│
├── workflows/
│
├── services/
│
├── controllers/
│
├── routes/
│
└── index.js
```

---

# 6. Request Lifecycle

Example: Create Activity

```
Admin

↓

POST /activities

↓

Activity Route

↓

authenticate()

↓

authorize()

↓

Validator

↓

validate()

↓

Activity Controller

↓

Activity Service

↓

Create Activity Workflow

↓

Activity Model

↓

MongoDB

↓

Response
```

---

# 7. Layer Responsibilities

## Routes

Responsibilities

- Define endpoints
- Attach middleware
- Connect controllers

Routes never contain business logic.

---

## Middleware

Middleware executes before controllers.

Used for:

- JWT Authentication
- Authorization
- Validation
- Error Handling

---

## Validators

Responsibilities

- Validate request body
- Validate params
- Validate query
- Prevent invalid requests

No business logic.

---

## Controllers

Controllers are the HTTP layer.

Responsibilities

- Receive request
- Call service
- Return response

Controllers never access the database directly.

---

## Services

Services act as the module's public API.

Responsibilities

- Expose module functionality
- Delegate to workflows

Other modules communicate only with services.

---

## Workflows

Workflows contain business use cases.

Examples

- Create Activity
- Publish Activity
- Approve Submission

Why workflows?

As RyuZen grows, each business process can become complex.

For example:

Approve Submission

↓

Update Submission

↓

Award Academic Points

↓

Create Notification

↓

Generate Certificate

↓

Trigger AI

↓

Analytics

Instead of making services huge, each workflow owns one business process.

---

## Helpers

Helpers contain reusable logic.

Examples

findActivity()

findSubmission()

This avoids duplicated database queries.

---

## Models

Models define MongoDB schemas.

Activities Module

- Activity
- ActivitySubmission

Models only describe data.

---

# 8. Database Design

```
Organization

│

├── Users

│

├── Activities

│

└── Activity Submissions
```

Relationships

Activity

- belongs to Organization
- created by User

Submission

- belongs to Activity
- belongs to Student

---

# 9. Authentication

Activities rely on the Auth module.

Flow

```
Login

↓

JWT

↓

Authorization Header

↓

Authenticate Middleware

↓

req.user
```

Controllers never verify JWT manually.

---

# 10. Authorization

Role Based Access

Student

- Submit Activity

Teacher

- Create
- Update
- Publish
- Close
- Approve
- Reject
- Attendance

Admin

Everything

---

# 11. Validation Flow

```
Client

↓

Validator

↓

validate()

↓

Controller
```

Advantages

- Cleaner controllers
- Reusable validation
- Standardized errors

---

# 12. Transactions

Some operations require multiple database updates.

Example

Approve Submission

↓

Update Submission

↓

Award Academic Points

↓

Update Statistics

↓

Create Notification

↓

Commit

If any operation fails

↓

Rollback

This guarantees data consistency.

---

# 13. Error Handling

Uses centralized errors.

Examples

BadRequestError

UnauthorizedError

ForbiddenError

NotFoundError

ConflictError

Every error is handled by the global error handler.

---

# 14. Multi-Tenant Architecture

RyuZen supports multiple organizations.

Every activity stores

Organization ID

Every query filters by

Organization ID

Benefits

- Data isolation
- Security
- SaaS readiness

---

# 15. Design Decisions

## Why Services?

To expose a stable public API.

---

## Why Workflows?

To isolate business use cases.

---

## Why Helpers?

To avoid duplicated queries.

---

## Why Validators?

To keep controllers clean.

---

## Why Transactions?

To ensure database consistency.

---

## Why Soft Delete?

To allow restoration and maintain history.

---

## Why AsyncHandler?

To eliminate repetitive try/catch blocks.

---

## Why APIResponse?

To standardize responses across the backend.

---

# 16. Future Enhancements

The following are intentionally postponed until after the MVP.

- Reward Engine
- XP System
- Certificates
- AI Feedback
- AI Evaluation
- Event Bus
- Redis Cache
- Analytics Dashboard
- Email Notifications
- Calendar Integration
- QR Attendance
- Face Recognition Attendance
- Scheduled Jobs

---

# Architecture Summary

```
Client

↓

Routes

↓

Middleware

↓

Validators

↓

Controllers

↓

Services

↓

Workflows

↓

Helpers

↓

Models

↓

MongoDB
```

This architecture keeps every layer focused on a single responsibility while remaining scalable for future growth into a multi-university SaaS platform.