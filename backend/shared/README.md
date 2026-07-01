# Shared Module

## Purpose

The Shared module contains reusable backend infrastructure that can be used by every feature module.

---

## Responsibilities

- Base schema
- Common constants
- Pagination
- Query builder
- Logging
- Shared middleware
- Shared utilities
- Shared validation

---

## Rule

Business logic should NEVER be placed inside the Shared module.

Only reusable infrastructure belongs here.

---

## Folder Structure

shared/

base/

constants/

query/

logger/

middleware/

errors/

utils/

validators/

---

## Used By

- Authentication
- Users
- Activities
- Chat
- Notifications
- AI
- Leaderboards