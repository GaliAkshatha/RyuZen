# User Module

Version: 1.0

Status: Completed

---

# Purpose

The User module represents every person using RyuZen.

Unlike authentication, which handles login and verification, the User module stores the user's identity and profile.

Authentication uses the User module but does not own it.

---

# Responsibilities

The User module stores

- Identity
- Authentication information
- Academic information
- Social profile
- Game profile
- Preferences
- Metadata

---

# Architecture

User

│

├── Identity

├── Authentication

├── Academic

├── Social

├── Game

├── Preferences

└── Metadata

---

# Identity

Represents who the user is.

Fields

- organization
- name
- email
- role
- profilePicture

Purpose

Every user belongs to one Organization.

This enables complete tenant isolation.

---

# Authentication

Purpose

Stores security-related information.

Fields

- password
- emailVerified
- refreshToken
- failedLoginAttempts
- lockUntil
- lastLogin

Important

Passwords are never stored in plain text.

Passwords are hashed using bcrypt.

Password field uses

select: false

so MongoDB never returns it unless explicitly requested.

---

# Academic

Purpose

Stores educational information.

Fields

- usn
- department
- semester
- section
- academicYear
- totalPoints
- rank

Academic points are cached here.

The detailed history will later be stored in a PointTransaction collection.

---

# Social

Purpose

Supports the future Connect module.

Fields

- bio
- skills
- interests

Future

followers

following

posts

stories

---

# Game

Purpose

Supports the gamification system.

Fields

- xp
- level
- streak
- achievements

Important

Do not store derived values like "Gold" or "Silver".

Instead store XP and Level.

Ranks should be calculated from configurable rules.

---

# Status

Possible values

PENDING

ACTIVE

SUSPENDED

Users are never deleted.

Inactive users retain historical data.

---

# Role

Possible values

SUPER_ADMIN

ORG_ADMIN

TEACHER

STUDENT

Role-Based Access Control (RBAC) uses these roles.

---

# Why group fields?

Instead of

user.department

user.password

user.level

user.bio

Use

user.academic.department

user.auth.password

user.game.level

user.social.bio

Benefits

- Easier maintenance
- Better readability
- Easier future expansion
- Cleaner architecture

---

# Future Expansion

AI Profile

Learning Preferences

Achievements

Badges

Notification Preferences

Privacy Settings