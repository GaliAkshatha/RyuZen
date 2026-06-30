# RyuZen System Architecture v2

Version: 2.0

Status: Approved

Project: RyuZen

Author: Akshatha

---

# Vision

RyuZen is a multi-tenant educational SaaS platform designed to support multiple organizations while maintaining complete data isolation and high scalability.

The architecture follows a **Microservice-Ready Modular Monolith** approach.

---

# Design Philosophy

Current Architecture

Modular Monolith

Future Architecture

Microservices

The system should require minimal code changes during migration.

---

# Why Not Microservices Today?

Microservices increase:

- Infrastructure complexity
- Deployment complexity
- Monitoring
- DevOps requirements
- Distributed debugging

At the current project size these costs outweigh the benefits.

---

# Why Modular Monolith?

Benefits

- Easy development
- Easier debugging
- Faster deployment
- Lower infrastructure cost
- Easier testing
- Easier learning

Every module is isolated internally, making future extraction simple.

---

# Modules

Authentication

Organization

User

Activity

Academic

Network

AI

Notification

Analytics

Game

Shared

---

# Shared Module

Logger

Constants

Utilities

Errors

Validators

Middleware

Configuration

Database

---

# Module Rules

Each module owns

Routes

Controllers

Services

Models

Validation

Documentation

No module directly accesses another module's database models.

Communication occurs through services.

---

# Organization Model

Every college is represented by an Organization.

Fields

- Name
- Logo
- Website
- Email Domains
- Registration Strategy
- Departments
- Semesters
- Academic Years
- Status

---

# Supported Registration Strategies

1. Email Domain Verification

2. Invitation Only

3. Student ID Verification

4. Google Workspace OAuth

5. Manual Approval

Every organization may configure its own strategy.

---

# Authentication Hierarchy

Platform Super Admin

↓

Organization Admin

↓

Teacher

↓

Student

---

# Future Microservice Split

Gateway

↓

Authentication Service

↓

Organization Service

↓

User Service

↓

Activity Service

↓

Network Service

↓

AI Service

↓

Notification Service

↓

Analytics Service

---

# Database Philosophy

Current

Single MongoDB

Future

Dedicated databases per service

Migration should require minimal business logic changes.

---

# Engineering Principles

- Separation of Concerns
- Single Responsibility
- Interface Driven Design
- Security First
- API First
- Modular Design
- Microservice Ready
- Cloud Ready

---

# Success Criteria

The application should support:

100+ organizations

100,000+ users

Millions of activities

Real-time messaging

AI features

without major architectural redesign.