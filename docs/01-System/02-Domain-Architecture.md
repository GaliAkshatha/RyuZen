# RyuZen Domain Architecture

**Document Type:** Software Architecture Document (SAD)

**Version:** 1.0

**Status:** Draft

**Owner:** Architecture Team

---

# Purpose

This document defines the domain boundaries of RyuZen.

It specifies:

- Business domains
- Domain ownership
- Module ownership
- Shared services
- Cross-domain communication
- Future scalability boundaries

This document acts as the foundation for:

- Database Design
- Backend Architecture
- Frontend Architecture
- API Design
- Event System
- AI Architecture

No feature should be implemented before determining the domain that owns it.

---

# Why Domain-Driven Design?

As software grows, organizing code by technical layers (controllers, routes, models) becomes difficult.

Instead, RyuZen organizes the system around business capabilities.

Every business capability belongs to exactly one domain.

Benefits include:

- Better scalability
- Clear ownership
- Easier onboarding
- Independent development
- Easier testing
- Future microservice readiness

---

# Domain Overview

```
                              RYUZEN

                                     │

──────────────────────────────────────────────────────────────

Identity Domain

Academic Domain

Community Domain

Professional Domain

Career Domain

Growth Domain

Intelligence Domain

Insights Domain

Shared Domain

Integration Domain

──────────────────────────────────────────────────────────────
```

---

# Domain Dependency Rules

Domains communicate through services or events.

No domain should directly access another domain's database.

```
Good

Activity

↓

Event

↓

Notification


Bad

Activity

↓

Notification Database
```

Only the owning domain can modify its own data.

---

# 1. Identity Domain

## Purpose

Manage identity and access across the platform.

## Responsibilities

- Authentication
- User Accounts
- Organizations
- Roles
- Permissions
- Sessions
- Privacy Settings
- Alumni Transition

## Modules

Authentication

Users

Organizations

Roles

Permissions

Sessions

Privacy

Profile

## Owns

- User
- Organization
- Role
- Permission
- Session

## Used By

Every domain.

---

# 2. Academic Domain

## Purpose

Manage all academic workflows.

## Responsibilities

- Activities
- Workshops
- Assignments
- Attendance
- Calendar
- Certificates
- Academic Leaderboards

## Modules

Activities

Assignments

Attendance

Calendar

Certificates

Academic Analytics

Leaderboards

## Owns

Activity

Submission

Attendance

Certificate

Academic Score

## Future

QR Attendance

Face Recognition

Exam Module

LMS Integration

---

# 3. Community Domain

## Purpose

Enable communication and collaboration.

## Responsibilities

Communication

Posts

Communities

Connections

Notifications

Feeds

Search

## Modules

Communication

Connect

Communities

Posts

Comments

Likes

Shares

Notifications

Feed

## Owns

Conversation

Participant

Message

Connection

Post

Comment

Reaction

Notification

Community

## Future

Voice Chat

Video Meetings

Live Streams

Community Events

---

# 4. Professional Domain

## Purpose

Build verified professional identities.

## Responsibilities

Projects

Portfolio

Skills

Resume

Experience

Recommendations

Certifications

Project Reviews

## Modules

Projects

Portfolio

Resume

Skills

Experience

Recommendations

Certificates

Open Source

## Owns

Project

Portfolio

Resume

Skill

Recommendation

Certificate

Experience

---

# 5. Career Domain

## Purpose

Continuously prepare students for careers.

## Responsibilities

Recruiters

Placements

Jobs

Mentorship

Internships

Referrals

Mock Interviews

Company Events

## Modules

Placement

Recruiters

Jobs

Internships

Mentorship

Referrals

Interview

Career Timeline

## Owns

Recruiter

Company

Job

Internship

Referral

Placement

Interview

---

# 6. Growth Domain

## Purpose

Encourage continuous engagement.

Gamification exists to motivate learning, not distract from it.

## Responsibilities

Daily Quests

Weekly Goals

Campus Games

Sports

Hackathons

Achievements

Rewards

Streaks

Levels

Challenges

## Modules

Quests

Challenges

Badges

Rewards

Sports

Hackathons

Treasure Hunts

Campus Games

Levels

Achievements

Growth Metrics

## Owns

Quest

Challenge

Badge

Reward

Growth Level

Growth Score

Mission

Streak

---

# 7. Intelligence Domain

## Purpose

Provide personalized AI assistance.

Every recommendation is private by default.

## Responsibilities

AI Mentor

Study Planner

Career Coach

Resume Review

Project Review

Skill Suggestions

Faculty Assistant

Recruiter Assistant

## Modules

Mentor

Coach

Resume AI

Project AI

Career AI

Planner

Faculty AI

Recruiter AI

## Owns

AI Conversations

AI Reports

Recommendations

Roadmaps

Learning Plans

---

# 8. Insights Domain

## Purpose

Interpret data.

Insights do not own business data.

They derive meaning from other domains.

## Responsibilities

Placement Readiness

Growth Timeline

Faculty Reports

Recruiter Reports

Analytics

Progress

Predictions

## Modules

Placement Insights

Growth Insights

Analytics

Reports

Predictions

Timeline

## Owns

Derived Metrics

Trend Reports

Growth Analysis

Dashboards

## Consumes

Academic

Community

Professional

Career

Growth

Intelligence

---

# 9. Shared Domain

## Purpose

Provide reusable infrastructure.

Contains no business logic.

## Services

Authentication

Authorization

Email

File Storage

Media

Logger

Audit Logs

Cache

Search

Utilities

Validation

Configuration

Error Handling

Response Builder

Event Publisher

---

# 10. Integration Domain

## Purpose

Integrate external systems.

No external API should be directly called from business domains.

## Integrations

Google Drive

Google Calendar

GitHub

LinkedIn

Microsoft 365

University ERP

Learning Management Systems

Cloudinary

AWS S3

Email Providers

Payment Gateways (Future)

OpenAI

Anthropic

Gemini

---

# Domain Ownership Matrix

| Domain | Owns Data | Can Modify | Others Read |
|----------|-----------|------------|-------------|
| Identity | ✅ | Identity | Via Services |
| Academic | ✅ | Academic | Via Services |
| Community | ✅ | Community | Via Services |
| Professional | ✅ | Professional | Via Services |
| Career | ✅ | Career | Via Services |
| Growth | ✅ | Growth | Via Services |
| Intelligence | ✅ | Intelligence | Via Services |
| Insights | Derived | Insights | Reports |
| Shared | Infrastructure | Shared | Everyone |
| Integration | External Systems | Integration | Everyone |

---

# Cross-Domain Communication

Domains should communicate using one of three approaches.

## 1. Service Call

For synchronous operations.

Example

Authentication

↓

Identity Service

↓

Validate User

---

## 2. Event

For asynchronous operations.

Example

Activity Completed

↓

Publish Event

↓

Growth

↓

Insights

↓

Notifications

↓

AI

---

## 3. Read Models (Future)

For complex analytics.

Insights reads data.

It never modifies it.

---

# Future Microservice Boundaries

The architecture is intentionally designed so each domain can become an independent service.

Potential future services

Identity Service

Academic Service

Community Service

Professional Service

Career Service

Growth Service

AI Service

Insights Service

Integration Service

This transition should require minimal code changes.

---

# Architecture Principles

Every domain follows these rules.

1. One business capability per domain.

2. One owner for every piece of business data.

3. No cross-domain database access.

4. Shared services contain no business logic.

5. Business logic lives inside domains.

6. Domains communicate through services or events.

7. Privacy is enforced at the domain level.

8. AI recommendations belong to the student.

9. Growth is measured continuously.

10. Architecture should evolve without rewrites.

---

# Final Architecture Vision

```
Students

↓

Identity

↓

Academic

↓

Community

↓

Professional

↓

Career

↓

Growth

↓

Intelligence

↓

Insights

↓

Long-Term Student Success
```

Every domain contributes toward one common goal.

> Continuous Student Growth.

# RyuZen Policy Architecture

**Document Type:** Software Architecture Document (SAD)

**Version:** 1.0

**Status:** Draft

**Last Updated:** July 2026

**Owner:** Architecture Team

---

# Purpose

The Policy Layer centralizes all platform rules that determine **what actions are allowed**, **who can perform them**, and **what information can be accessed**.

Rather than scattering permission checks throughout controllers and services, every domain consults the Policy Layer before performing sensitive operations.

The Policy Layer enables:

- Privacy by Design
- Multi-University Customization
- Fine-Grained Permissions
- Human-Centered AI
- Future Enterprise Scalability

---

# Why a Policy Layer?

Authentication answers:

> **Who are you?**

Authorization answers:

> **What role do you have?**

Policies answer:

> **Given this user, organization, and situation, what is allowed?**

Policies are dynamic.

Different universities may configure different rules without changing business logic.

---

# High-Level Architecture

```text
                     Request

                        │

                        ▼

              Authentication

                        │

                        ▼

              Authorization

                        │

                        ▼

                Policy Engine

                        │

          ┌─────────────┼──────────────┐

          │             │              │

      Allowed      Restricted      Denied

          │             │              │

          ▼             ▼              ▼

      Continue     Filter Response    Error
```

---

# Responsibilities

The Policy Layer is responsible for:

- Privacy enforcement
- Organization-specific rules
- Communication permissions
- AI visibility
- Alumni access
- Recruiter visibility
- Data sharing consent
- Moderation policies
- Content visibility
- Feature availability

The Policy Layer is **not** responsible for business logic.

---

# Policy Categories

## 1. Privacy Policies

Determine who can access personal information.

Examples

- Student Profile Visibility
- AI Report Visibility
- Contact Information
- Portfolio Visibility
- Academic Record Sharing

Example

```text
Student AI Report

↓

Student

✅ Full Access

Faculty

❌ Hidden

Recruiter

❌ Hidden

Admin

❌ Hidden
```

---

## 2. Organization Policies

Every university can define its own rules.

Examples

- Cross-University Messaging
- Club Creation
- Alumni Access
- Recruiter Access
- External Collaboration

Example

```text
RVITM

↓

Allows

Cross-University Projects

Allows

External Recruiters

Blocks

External Club Management
```

---

## 3. Communication Policies

Controls communication across the platform.

Examples

- Student → Student
- Student → Faculty
- Student → Alumni
- Recruiter → Student
- Cross-University Messaging
- AI Conversations

Example

```text
Recruiter

↓

Can Message

Only Students

Who Enabled

Recruiter Communication
```

---

## 4. AI Policies

AI recommendations are private by default.

Visibility Levels

### Personal

Only the student.

Examples

- Skill Gaps
- Learning Habits
- Career Suggestions
- Mental Workload Estimation
- Daily Roadmap

---

### Shared

Only if the student explicitly shares it.

Examples

- Resume Review
- Project Review
- Skill Report

---

### Institutional

Privacy-preserving summaries.

Examples

```text
Student

↓

May Benefit From

Mentoring
```

The underlying AI reasoning is never exposed.

---

## 5. Recruiter Policies

Controls recruiter access.

Recruiters may access:

- Public Profile
- Projects
- Skills
- Verified Achievements
- Placement Readiness (if enabled)
- Resume (if shared)

Recruiters may never access:

- AI Reports
- Personal Notes
- Learning Habits
- Teacher Feedback
- Wellness Indicators

---

## 6. Alumni Policies

Graduates may convert their account into an Alumni account.

Policies include:

- Personal Email Migration
- Identity Preservation
- Mentorship Permissions
- Referral Permissions
- Organization Membership
- Community Access

Alumni retain their professional identity while respecting institutional policies.

---

## 7. Growth Policies

Control gamification and motivation.

Examples

- Daily Quest Frequency
- Challenge Participation
- Reward Eligibility
- Badge Visibility
- Leaderboard Participation

Organizations may customize:

- Point Systems
- Challenge Types
- Campus Events

---

## 8. Content Moderation Policies

Responsible for:

- Offensive Content
- Spam Detection
- AI Content Review
- Community Guidelines
- Reporting
- Escalation

Future versions may integrate AI-assisted moderation.

---

# Human-Centered AI Policy

One of the core principles of RyuZen.

Whenever AI detects a student who may require support:

1. AI privately informs the student.
2. AI suggests reaching out to a mentor.
3. Faculty receives only:

```
Student may benefit from an academic check-in.
```

4. Continued concerns may escalate to department leadership.

At no stage does AI expose:

- Mental Health
- Emotional State
- Personal Conversations
- Private Reasoning
- Confidence Scores

The platform encourages **human conversation**, not automated judgment.

---

# Student Wellbeing Policy

RyuZen is designed to motivate rather than pressure.

The platform follows these principles.

## Privacy by Default

Students own their personal AI insights.

---

## Student Control

Students choose what reports to share.

---

## Positive Reinforcement

The platform avoids negative labels.

Instead of:

- Weak Student
- Poor Performance
- Failing

Use:

- Needs Encouragement
- Ready for Improvement
- Making Progress

---

## Escalation with Care

Support progresses gradually.

```text
AI Notices Pattern

↓

Student Guidance

↓

Mentor Recommendation

↓

Teacher Check-In

↓

Department Support

↓

Student Success
```

Escalation exists to provide support—not punishment.

---

# Policy Evaluation Flow

Every sensitive request follows the same sequence.

```text
Incoming Request

↓

Authentication

↓

Authorization

↓

Policy Engine

↓

Business Logic

↓

Database

↓

Response Filtering

↓

Client
```

No business operation bypasses policy evaluation.

---

# Policy Ownership

| Policy Type | Owner Domain |
|-------------|--------------|
| Privacy | Identity |
| Organization | Identity |
| Communication | Community |
| AI | Intelligence |
| Recruiter | Career |
| Alumni | Identity |
| Growth | Growth |
| Moderation | Community |
| Data Sharing | Identity |

---

# Future Policy Engine

As RyuZen grows, policies should become configurable rather than hardcoded.

Example

```text
University Admin

↓

Policy Dashboard

↓

Enable

Cross-University Messaging

Disable

Recruiter Messaging

Enable

Alumni Mentorship
```

No code changes required.

---

# Design Principles

The Policy Layer follows these principles.

1. Privacy before convenience.
2. Human judgment before automated decisions.
3. Student ownership of personal data.
4. Configurable organization rules.
5. Least privilege by default.
6. Separation of business logic and policy logic.
7. Every sensitive action must pass through policy evaluation.
8. Policies should evolve without changing domain logic.

---

# Guiding Statement

> The Policy Layer ensures that RyuZen remains a trusted platform by protecting user privacy, respecting organizational autonomy, and enabling ethical, human-centered decision making while supporting continuous student growth.