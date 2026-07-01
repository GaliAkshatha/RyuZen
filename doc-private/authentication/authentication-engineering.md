# Password Service

## Responsibility

The Password Service centralizes all password-related business logic.

It acts as a layer between authentication workflows and the bcrypt utility.

RegistrationService and LoginService never communicate with bcrypt directly.

---

## Responsibilities

- Hash passwords
- Verify passwords
- (Future)
  - Change password
  - Forgot password
  - Reset password

---

## Architecture

RegistrationService

↓

PasswordService

↓

password.js

↓

bcrypt

---

## Why not call bcrypt directly?

Advantages

- Single source of truth
- Easier testing
- Easier future extension
- Better separation of concerns