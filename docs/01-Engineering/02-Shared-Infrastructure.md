# RyuZen Shared Infrastructure Architecture

**Document Type:** Engineering Architecture Document (EAD)

**Version:** 1.0

**Status:** Approved

**Owner:** Engineering Team

---

# Purpose

The Shared Infrastructure layer provides reusable technical capabilities that are used across every domain in RyuZen.

It contains no business logic.

Instead, it provides platform services that enable domains to remain focused on business responsibilities.

Examples include:

- Authentication
- Logging
- Validation
- Error Handling
- API Responses
- Database Access
- Event Bus
- Policy Engine
- Storage
- Mail

Every domain depends on Shared Infrastructure.

Shared Infrastructure depends on no domain.

---

# Design Principles

The Shared layer follows the following principles.

## 1. No Business Logic

The Shared layer must never contain:

- Activities
- Users
- Projects
- Jobs
- Messages

Business logic belongs inside domains.

---

## 2. Reusable

Every component should be reusable by every domain.

---

## 3. Independent

Shared should never import business domains.

```
Good

Academic

↓

Shared Logger

Bad

Shared Logger

↓

Academic
```

Dependencies always point inward.

---

# Folder Structure

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

repositories/

responses/

storage/

types/

utils/

validators/
```

---

# Shared API

Purpose

Provide common API utilities.

Structure

```
api/

ApiRequest.ts

ApiContext.ts

ApiMetadata.ts
```

Responsibilities

- Request metadata
- Request context
- API utilities

---

# Authentication

Purpose

Identity verification.

Structure

```
auth/

JwtProvider.ts

PasswordHasher.ts

TokenGenerator.ts

RefreshToken.ts

index.ts
```

Responsibilities

- Generate JWT
- Verify JWT
- Hash Passwords
- Compare Passwords

---

# Cache

Purpose

Improve application performance.

Structure

```
cache/

CacheProvider.ts

RedisProvider.ts

MemoryCache.ts
```

Initially

Memory Cache.

Future

Redis.

---

# Constants

Purpose

Centralize shared constants.

Examples

```
Roles

Permissions

Status

Pagination

Date Formats
```

Never duplicate constants.

---

# Database

Purpose

Provide reusable database utilities.

Structure

```
database/

MongoConnection.ts

TransactionManager.ts

DatabaseHealth.ts

index.ts
```

Responsibilities

- Connect MongoDB
- Health Checks
- Transactions

---

# Errors

Purpose

Centralize exception handling.

Structure

```
errors/

ApiError.ts

BadRequestError.ts

ValidationError.ts

UnauthorizedError.ts

ForbiddenError.ts

ConflictError.ts

NotFoundError.ts

InternalServerError.ts

index.ts
```

Every error extends ApiError.

---

# Events

Purpose

Enable loose coupling.

Structure

```
events/

Event.ts

EventBus.ts

EventPublisher.ts

EventSubscriber.ts

DomainEvent.ts

index.ts
```

Initially

In-process events.

Future

Kafka

Redis Streams

RabbitMQ

No code changes required.

---

# Jobs

Purpose

Background processing.

Structure

```
jobs/

Queue.ts

Worker.ts

Scheduler.ts
```

Future

BullMQ.

Examples

- Emails
- Notifications
- AI Reports

---

# Logger

Purpose

Centralized logging.

Structure

```
logger/

Logger.ts

RequestLogger.ts

AuditLogger.ts

PerformanceLogger.ts

index.ts
```

Supports

- Request Logs
- Audit Logs
- Error Logs
- Performance Logs

---

# Mail

Purpose

Email abstraction.

Structure

```
mail/

MailProvider.ts

Templates/

Services/

index.ts
```

Supports

- SMTP
- SendGrid
- AWS SES

---

# Middleware

Purpose

Reusable Express middleware.

Structure

```
middleware/

authenticate.ts

authorize.ts

validate.ts

requestId.ts

rateLimiter.ts

errorHandler.ts

notFound.ts

index.ts
```

No business logic.

---

# Policies

Purpose

Platform-wide authorization engine.

Structure

```
policies/

PolicyEngine.ts

PolicyContext.ts

PolicyResult.ts

PolicyRegistry.ts

index.ts
```

Every sensitive operation passes through the Policy Engine.

---

# Repositories

Purpose

Reusable database abstraction.

Structure

```
repositories/

BaseRepository.ts

RepositoryOptions.ts

Pagination.ts

Filters.ts
```

Every domain repository extends BaseRepository.

---

# Responses

Purpose

Standardized API responses.

Structure

```
responses/

ApiResponse.ts

ApiPagination.ts

ApiMeta.ts

index.ts
```

Every endpoint returns the same response format.

---

# Storage

Purpose

File management.

Structure

```
storage/

StorageProvider.ts

CloudinaryProvider.ts

S3Provider.ts

FileValidator.ts
```

Large files are never stored in MongoDB.

---

# Types

Purpose

Global shared TypeScript types.

Examples

```
Pagination

AuthenticatedUser

ApiResponse

JWTPayload

PolicyResult
```

---

# Utilities

Purpose

Pure helper functions.

Examples

```
Date

UUID

String

Array

Object

Encryption

Formatting
```

Utilities must be stateless.

---

# Validators

Purpose

Reusable validation schemas.

Examples

```
Pagination

ObjectId

Email

Password

Phone

URL
```

Business validation belongs inside domains.

---

# Dependency Rules

```
Domains

↓

Shared

↓

Config

↓

Infrastructure
```

Shared never depends on domains.

---

# Lifecycle

Every request may use multiple shared services.

```
Request

↓

Authentication

↓

Authorization

↓

Policy Engine

↓

Validation

↓

Logger

↓

Repository

↓

Response Builder
```

---

# Future Evolution

The Shared Infrastructure layer is designed to evolve independently.

Examples

Memory Cache

↓

Redis

No domain changes required.

---

SMTP

↓

AWS SES

No domain changes required.

---

Local Storage

↓

S3

No domain changes required.

---

In-process Events

↓

Kafka

No domain changes required.

---

# Engineering Principles

1. Shared contains no business logic.

2. Shared services are reusable.

3. Domains depend on Shared.

4. Shared never depends on domains.

5. Infrastructure changes should not affect business logic.

6. Every service should have one responsibility.

7. Shared APIs should remain stable.

8. Future infrastructure upgrades should require minimal code changes.

---

# Guiding Statement

> The Shared Infrastructure layer provides the technical foundation of RyuZen. It isolates infrastructure concerns from business logic, enabling the platform to evolve, scale, and integrate new technologies without disrupting domain implementations.