# Authentication

Version: 1.0

Status: In Progress

---

# Purpose

Authentication answers one question:

"Who is this user?"

Authentication verifies identity.

Authorization determines what that user can do.

---

# Authentication Flow

Register

↓

Validation

↓

Organization Validation

↓

Password Hashing

↓

Store User

↓

Email Verification

↓

Admin Approval

↓

Login

↓

Generate JWT

↓

Protected Routes

---

# Password Hashing

Passwords are never stored directly.

Instead

Password

↓

bcrypt

↓

Hash

Example

Hello@123

↓

$2b$12$JDJkfj...

Hashes cannot be decrypted.

---

# Why bcrypt?

bcrypt

- Generates a random salt
- Hashes the password
- Protects against rainbow table attacks
- Slows brute-force attacks

Current Configuration

Salt Rounds

12

Higher rounds increase security but also increase computation time.

---

# Password Utility

File

modules/auth/utils/password.js

Functions

hashPassword()

comparePassword()

Purpose

Centralize all password-related logic.

No controller or service should directly call bcrypt.

---

# JWT

JWT

JSON Web Token

Purpose

Stateless authentication.

Instead of storing sessions on the server, the client stores a signed token.

---

# JWT Structure

Header

↓

Payload

↓

Signature

---

# Payload

Current Payload

- User ID
- Organization ID
- Role

Never store

- Password
- Sensitive personal data

---

# JWT Utility

File

modules/auth/utils/jwt.js

Functions

generateAccessToken()

verifyAccessToken()

Purpose

Centralize JWT creation and verification.

---

# Why use utilities?

Instead of writing

jwt.sign()

throughout the application,

all modules call

generateAccessToken()

Benefits

- Single source of truth
- Easier maintenance
- Easier configuration changes

---

# JSDoc

Purpose

Documents public functions.

Improves readability and IDE support.

Example

/**
 * Hashes a user's password.
 *
 * @param {string} password
 * @returns {Promise<string>}
 */

Benefits

- Better IntelliSense
- Easier onboarding
- Self-documenting code
- Easier maintenance

Use JSDoc for

✓ Services

✓ Utilities

✓ Middleware

Avoid JSDoc for

✗ Models

✗ Routes

✗ Simple Controllers

---

# Authentication Utilities

Current

✓ password.js

✓ jwt.js

Future

□ authService.js

□ authenticate.js

□ authorize.js

□ refreshTokens.js

□ forgotPassword.js

□ emailVerification.js