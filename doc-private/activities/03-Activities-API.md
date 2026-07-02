# Activities Module API Documentation

> **Module:** Activities
>
> **Version:** v1
>
> **Authentication:** JWT Bearer Token
>
> **Base URL**
>
> ```
> /api/v1
> ```

---

# Table of Contents

1. Authentication
2. Activity APIs
3. Submission APIs
4. Report APIs
5. Response Format
6. Error Responses
7. Role Permissions
8. Status Codes

---

# Authentication

All endpoints require JWT unless otherwise stated.

Header

```http
Authorization: Bearer <access_token>
```

Authentication Flow

```
Client

↓

JWT Token

↓

Authenticate Middleware

↓

req.user

↓

Controller
```

---

# Standard Response Format

Success

```json
{
    "success": true,
    "message": "Activity created successfully.",
    "data": {}
}
```

Error

```json
{
    "success": false,
    "message": "Activity not found."
}
```

---

# Activity APIs

---

## Create Activity

Creates a new activity.

### Endpoint

```http
POST /api/v1/activities
```

### Roles

- Admin
- Teacher

### Request

```json
{
    "title": "Web Development Workshop",
    "description": "React Workshop",
    "type": "WORKSHOP",

    "config": {

        "venue": "Seminar Hall",

        "startDate": "2026-08-01",

        "endDate": "2026-08-01"

    },

    "rules": {

        "academicPoints": 100,

        "penaltyPoints": 20,

        "maxParticipants": 120

    }

}
```

### Success Response

```http
201 Created
```

```json
{
    "success": true,
    "message": "Activity created successfully.",
    "data": {

        "id": "...",

        "title": "Web Development Workshop"

    }
}
```

### Possible Errors

| Status | Reason |
|---------|--------|
|400|Validation Failed|
|401|Unauthorized|
|403|Permission Denied|
|409|Duplicate Activity|

---

## Update Activity

```http
PUT /api/v1/activities/:id
```

Roles

- Admin
- Teacher

Request

```json
{
    "title": "Updated Workshop"
}
```

Response

```json
{
    "success": true,
    "message": "Activity updated successfully."
}
```

Errors

- 400
- 401
- 403
- 404

---

## Publish Activity

```http
PATCH /api/v1/activities/:id/publish
```

Roles

- Admin
- Teacher

Response

```json
{
    "success": true,
    "message": "Activity published successfully."
}
```

---

## Close Activity

```http
PATCH /api/v1/activities/:id/close
```

Roles

- Admin
- Teacher

Response

```json
{
    "success": true,
    "message": "Activity closed successfully."
}
```

---

## Delete Activity

Soft Delete

```http
DELETE /api/v1/activities/:id
```

Roles

- Admin

Response

```json
{
    "success": true,
    "message": "Activity deleted successfully."
}
```

---

# Submission APIs

---

## Submit Activity

```http
POST /api/v1/submissions/activities/:id
```

Roles

- Student

### Request

```json
{
    "answers": {

        "github":

        "https://github.com/user/project"

    },

    "attachment":

    "report.pdf"

}
```

### Response

```json
{
    "success": true,
    "message": "Submission successful."
}
```

### Errors

|Status|Reason|
|------|------|
|400|Already Submitted|
|401|Unauthorized|
|404|Activity Not Found|

---

## Approve Submission

```http
PATCH /api/v1/submissions/:id/approve
```

Roles

- Teacher
- Admin

Request

```json
{
    "feedback":

    "Excellent Work",

    "score":

    96

}
```

Response

```json
{
    "success": true,
    "message": "Submission approved."
}
```

---

## Reject Submission

```http
PATCH /api/v1/submissions/:id/reject
```

Roles

- Teacher
- Admin

Request

```json
{
    "feedback":

    "Please improve formatting."
}
```

Response

```json
{
    "success": true,
    "message": "Submission rejected."
}
```

---

## Mark Attendance

```http
PATCH /api/v1/submissions/:id/attendance
```

Roles

- Teacher
- Admin

Response

```json
{
    "success": true,
    "message": "Attendance marked."
}
```

---

# Report APIs

---

## Export CSV

```http
GET /api/v1/reports/activities/:id/csv
```

Roles

- Teacher
- Admin

Produces

```
text/csv
```

Response

Downloads

```
activity-report.csv
```

---

# Validation Rules

## Activity

|Field|Validation|
|------|----------|
|title|Required|
|description|Optional|
|type|Enum|
|config|Object|
|rules|Object|

---

## Submission

|Field|Validation|
|------|----------|
|answers|Object|
|attachment|Optional|

---

# Role Permissions

|API|Student|Teacher|Admin|
|----|:----:|:------:|:---:|
|Create Activity|❌|✅|✅|
|Update Activity|❌|✅|✅|
|Publish Activity|❌|✅|✅|
|Close Activity|❌|✅|✅|
|Delete Activity|❌|❌|✅|
|Submit Activity|✅|❌|❌|
|Approve Submission|❌|✅|✅|
|Reject Submission|❌|✅|✅|
|Attendance|❌|✅|✅|
|Export CSV|❌|✅|✅|

---

# HTTP Status Codes

|Status|Meaning|
|------|-------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Server Error|

---

# Security Notes

The Activities module follows these security principles:

- Every endpoint requires authentication.
- Role-based authorization is enforced using middleware.
- Validation is performed before controllers execute.
- Business logic never trusts client input.
- Organization ID is always derived from the authenticated user, never from the request body.
- Activities are soft-deleted to preserve history.
- Approval workflows use MongoDB transactions to maintain consistency.
- Business logic is isolated from HTTP logic through services and workflows.

---

# API Design Principles

The Activities API follows these conventions:

- RESTful endpoint naming.
- Resource-oriented URLs.
- Consistent response format.
- Thin controllers.
- Business logic in workflows.
- Services act as the module's public API.
- Standard HTTP status codes.
- JWT-based authentication.
- Multi-tenant isolation.
- Transaction-safe critical operations.

---

# Future APIs

These endpoints are planned after the MVP:

```
POST   /activities/:id/certificate

GET    /activities/:id/leaderboard

GET    /activities/:id/analytics

POST   /activities/:id/feedback

POST   /activities/:id/qr-attendance

POST   /activities/:id/face-attendance

GET    /activities/:id/certificate/:studentId

GET    /activities/:id/statistics
```

These features will integrate with the AI, Analytics, Notification, and Reward Engine modules while keeping the Activities API stable.