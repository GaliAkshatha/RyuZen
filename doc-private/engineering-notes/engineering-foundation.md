# Engineering Foundation

Sprint

Foundation Architecture

---

## Goal

Build reusable backend infrastructure before implementing business features.

The objective is to avoid duplicating code across every module.

---

## Shared Architecture

shared/

config/

constants/

database/

errors/

middleware/

utils/

validators/

---

## Components Built

### Environment Configuration

env.js

Purpose

Single source of truth for every environment variable.

Why?

Avoid using process.env everywhere.

Instead

env.JWT_SECRET

env.PORT

env.MONGO_URI

---

### Environment Validation

validateEnv.js

Purpose

Validate application configuration before the server starts.

Checks

- Missing variables
- Invalid NODE_ENV
- Invalid PORT

Pattern

Fail Fast

---

### Error Handling

Custom Error Classes

AppError

ConflictError

ValidationError

NotFoundError

UnauthorizedError

ForbiddenError

BadRequestError

Purpose

Business logic throws meaningful errors.

Controllers never decide HTTP status codes.

---

### Global Error Handler

Purpose

Convert application errors into API responses.

Benefits

- One error format
- Cleaner controllers
- Easier debugging

---

### Async Handler

Purpose

Automatically forwards async errors.

Removes repetitive try/catch blocks.

---

### Validation Middleware

Purpose

Handle express-validator results.

Benefits

- Controllers only receive valid requests.
- Standard validation response.

---

### API Response Helper

Purpose

Standardize successful responses.

Example

{
    success,
    message,
    data
}

---

### Logger

Purpose

Centralized logging.

Future

Replace with Winston or Pino.

---

## Engineering Principles

- Separation of Concerns
- DRY
- Single Responsibility
- Fail Fast
- Configuration over Hardcoding
- Reusable Middleware
- Centralized Error Handling

---

## Folder Structure

shared/

config/

errors/

middleware/

utils/

validators/

---

## Benefits

Every future module

Authentication

Activities

AI

Network

Game

Analytics

can reuse the exact same infrastructure.

No duplicated code.