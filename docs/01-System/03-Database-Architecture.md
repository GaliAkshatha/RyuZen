# RyuZen Database Architecture

**Document Type:** Software Architecture Document (SAD)

**Version:** 1.0

**Status:** Draft

**Last Updated:** July 2026

**Owner:** Architecture Team

---

# Purpose

This document defines the database architecture of RyuZen.

It establishes the standards, principles, and strategies used to design, organize, store, and manage data across the platform.

This document is independent of any specific database implementation.

Whether RyuZen uses MongoDB today or additional databases in the future, every data model should follow these architectural principles.

---

# Objectives

The database architecture is designed to achieve the following goals.

- Scalability
- Maintainability
- Consistency
- Security
- Privacy
- High Performance
- Multi-Tenant Support
- AI Readiness
- Analytics Readiness
- Minimal Data Duplication

---

# Database Philosophy

Data is one of the most valuable assets of the platform.

Every piece of data should have:

- A single owner
- A clear lifecycle
- A defined access policy
- A clear purpose

No information should exist without ownership.

No information should be duplicated unnecessarily.

Every collection should represent a business concept.

---

# Database Strategy

RyuZen follows a **Polyglot Persistence Strategy**.

Different databases solve different problems.

The platform evolves progressively.

---

## Phase 1

Primary Database

MongoDB Atlas

Stores:

- Users
- Organizations
- Activities
- Messages
- Projects
- Notifications
- Communities

---

## Phase 2

Redis

Introduced for:

- Cache
- Sessions
- Presence
- OTP
- Rate Limiting
- Queue State

---

## Phase 3

PostgreSQL

Introduced for:

- Financial Data
- Payments
- Audit Records
- Strong Relational Workflows

---

## Phase 4

OpenSearch

Introduced for:

- Global Search
- Recommendation Search
- Recruiter Search
- Project Search
- Community Search

---

# Database Ownership

Every collection belongs to exactly one domain.

| Collection | Owner |
|------------|--------|
| Users | Identity |
| Organizations | Identity |
| Activities | Academic |
| Activity Submissions | Academic |
| Messages | Community |
| Conversations | Community |
| Posts | Community |
| Projects | Professional |
| Skills | Professional |
| Jobs | Career |
| Quests | Growth |
| AI Reports | Intelligence |
| Placement Insights | Insights |

No other domain directly modifies another domain's collections.

---

# Multi-Tenant Architecture

RyuZen is a multi-tenant platform.

Each university represents one tenant.

```
Platform

↓

Organization

↓

Department

↓

Club

↓

Activity

↓

Submission
```

Every tenant owns its own academic data.

Cross-organization collaboration is controlled through platform policies.

---

# Data Visibility Levels

Every collection must define its visibility.

## Public

Visible to everyone.

Examples

- Public Profiles
- Public Posts
- Open Communities

---

## Organization

Visible only inside an organization.

Examples

- Announcements
- Internal Clubs
- Events

---

## Private

Visible only to the owner.

Examples

- Draft Projects
- Saved Posts
- Notes

---

## AI Private

Visible only to the student.

Examples

- AI Reports
- Learning Analysis
- Skill Gaps
- Career Suggestions

---

## Institutional

Visible only as privacy-preserving summaries.

Examples

- Student needs mentoring
- Participation trends
- Department analytics

---

# Collection Standards

Every collection follows the same structure.

Required Fields

```
_id

createdAt

updatedAt

createdBy

updatedBy

organizationId

status
```

Optional

```
deletedAt

deletedBy

version

metadata
```

---

# Naming Conventions

Collections

Plural

```
users

activities

projects

messages
```

Models

Singular

```
User

Activity

Project
```

IDs

```
userId

activityId

projectId
```

Never

```
uid

aid

pid
```

---

# Relationship Strategy

Relationships should be designed based on access patterns.

---

## Embed

Use embedding when:

- Data is small
- Data is tightly coupled
- Data rarely changes independently

Examples

Activity

↓

Form Fields

Conversation

↓

Participant Settings

---

## Reference

Use referencing when:

- Data grows independently
- Shared across collections
- Frequently updated

Examples

Submission

↓

User

Message

↓

Conversation

Project

↓

Owner

---

# Transactions

Transactions should only be used when multiple operations must succeed together.

Example

```
Approve Activity

↓

Academic Score

↓

Growth Score

↓

Notification

↓

Insights

↓

Commit
```

If one operation fails,

everything rolls back.

---

# Soft Delete Policy

Data is rarely permanently deleted.

Instead

```
status = archived

deletedAt

deletedBy
```

Advantages

- Recovery
- Audit
- Analytics
- Legal Compliance

---

# Audit Strategy

Critical operations generate audit records.

Examples

- Role Changes
- Organization Settings
- Activity Approval
- Recruiter Access
- AI Report Sharing

Audit logs are immutable.

---

# Versioning

Certain collections support version history.

Examples

Resume

Portfolio

Projects

Policies

Future

Activity Forms

Versioning enables:

- Rollback
- History
- Collaboration

---

# Indexing Standards

Indexes are designed from the beginning.

Every collection should include indexes for:

- Foreign Keys
- Frequently Queried Fields
- Search Fields
- Date Fields

Compound indexes should match common query patterns.

---

# Event Storage

Business events may be stored for analytics.

Examples

```
Activity Completed

Quest Finished

Project Submitted

Profile Updated

Mentorship Accepted
```

Events become the foundation for analytics and AI.

---

# Read Models

Insights should not execute expensive joins across domains.

Instead

```
Events

↓

Aggregator

↓

Read Models

↓

Insights
```

Read models are optimized for queries.

They are never directly modified by users.

---

# File Storage

Large files are never stored inside MongoDB.

Files are stored externally.

Examples

- AWS S3
- Cloudinary

The database stores only:

- URL
- Metadata
- Ownership
- Permissions

---

# Privacy by Design

Every collection follows the platform privacy model.

```
Public

↓

Organization

↓

Private

↓

AI Private

↓

Institutional
```

Access is enforced by the Policy Layer.

---

# Data Lifecycle

Every entity follows a lifecycle.

Example

```
Created

↓

Active

↓

Archived

↓

Deleted (Soft)

↓

Purged (If Required)
```

---

# Backup Strategy

Production deployments should include:

- Automated Daily Backups
- Point-in-Time Recovery
- Geo-Replication
- Disaster Recovery

---

# Scalability Strategy

The database evolves progressively.

### MVP

MongoDB Atlas

↓

### Growth

Redis

↓

### Medium Scale

Read Replicas

↓

### Enterprise

Polyglot Persistence

↓

### Global Scale

Sharding

CDN

Distributed Search

---

# Database Design Principles

Every schema should follow these principles.

1. One owner per entity.
2. Embed when data is small and tightly coupled.
3. Reference when data grows independently.
4. Never duplicate business logic.
5. Minimize duplication of data.
6. Every entity belongs to one organization unless explicitly global.
7. Respect platform privacy levels.
8. Prefer soft deletes over hard deletes.
9. Design indexes before deployment.
10. Build for evolution rather than rewrites.

---

# Guiding Statement

> The RyuZen database architecture is designed to preserve data integrity, support long-term scalability, protect user privacy, and enable continuous platform evolution while remaining simple enough to develop and maintain efficiently.