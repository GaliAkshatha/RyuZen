# Activities Module - Request Flows

> This document explains how every request travels through the Activities module, from the client to the database and back.

---

# Table of Contents

1. Request Lifecycle
2. Create Activity
3. Update Activity
4. Publish Activity
5. Close Activity
6. Delete Activity
7. Submit Activity
8. Approve Submission
9. Reject Submission
10. Mark Attendance
11. Export CSV
12. Common Middleware Flow
13. Transaction Flow
14. Module Interaction Flow

---

# 1. General Request Lifecycle

Every request in the Activities module follows the same pipeline.

```
Client

↓

Route

↓

Authentication Middleware

↓

Authorization Middleware

↓

Validator

↓

Validate Middleware

↓

Controller

↓

Service

↓

Workflow

↓

Helper

↓

Model

↓

MongoDB

↓

Response
```

Each layer has a single responsibility.

---

# 2. Create Activity Flow

Actor

- Admin
- Teacher

```
Admin

↓

POST /activities

↓

authenticate()

↓

authorize()

↓

createActivityValidator

↓

validate()

↓

ActivityController.createActivity()

↓

ActivityService.createActivity()

↓

CreateActivityWorkflow

↓

Activity.create()

↓

MongoDB

↓

Activity Created

↓

ApiResponse.success()
```

Database Operations

- Create Activity
- Assign Organization
- Assign Creator
- Initialize Statistics
- Set Draft Status

---

# 3. Update Activity Flow

```
Admin

↓

PUT /activities/:id

↓

authenticate()

↓

authorize()

↓

updateActivityValidator

↓

validate()

↓

ActivityController

↓

ActivityService

↓

UpdateActivityWorkflow

↓

findActivity()

↓

Activity.save()

↓

MongoDB

↓

Success Response
```

Database Operations

- Find Activity
- Verify Organization
- Update Fields
- Save

---

# 4. Publish Activity

```
Teacher

↓

PATCH /activities/:id/publish

↓

authenticate()

↓

authorize()

↓

Controller

↓

Service

↓

PublishActivityWorkflow

↓

findActivity()

↓

Status = Published

↓

publishedAt = Current Time

↓

Save

↓

Response
```

---

# 5. Close Activity

```
Teacher

↓

PATCH /activities/:id/close

↓

authenticate()

↓

authorize()

↓

Controller

↓

Service

↓

CloseActivityWorkflow

↓

findActivity()

↓

Status = Closed

↓

closedAt = Current Time

↓

Save

↓

Response
```

---

# 6. Delete Activity

Soft Delete

```
Admin

↓

DELETE /activities/:id

↓

authenticate()

↓

authorize()

↓

Controller

↓

Service

↓

DeleteActivityWorkflow

↓

findActivity()

↓

isDeleted = true

↓

Save

↓

Response
```

No records are permanently removed.

---

# 7. Submit Activity

Actor

Student

```
Student

↓

POST /submissions/activities/:id

↓

authenticate()

↓

authorize(Student)

↓

submitActivityValidator

↓

validate()

↓

SubmissionController

↓

ActivityService

↓

SubmitActivityWorkflow

↓

findActivity()

↓

Check Existing Submission

↓

Create Submission

↓

MongoDB

↓

Response
```

Database Operations

- Verify Activity
- Prevent Duplicate Submission
- Create Submission

---

# 8. Approve Submission

This is the most important workflow.

```
Teacher

↓

PATCH /submissions/:id/approve

↓

authenticate()

↓

authorize()

↓

SubmissionController

↓

ActivityService

↓

ApproveSubmissionWorkflow

↓

Start Transaction

↓

findSubmission()

↓

findActivity()

↓

Update Submission

↓

Award Academic Points

↓

Update Activity Statistics

↓

Create Notification

↓

Commit Transaction

↓

Response
```

If anything fails

```
Rollback Transaction

↓

Nothing Changes
```

---

# 9. Reject Submission

```
Teacher

↓

PATCH /submissions/:id/reject

↓

authenticate()

↓

authorize()

↓

Controller

↓

Service

↓

RejectSubmissionWorkflow

↓

findSubmission()

↓

Status = Rejected

↓

Save

↓

Response
```

---

# 10. Mark Attendance

```
Teacher

↓

PATCH /submissions/:id/attendance

↓

authenticate()

↓

authorize()

↓

Controller

↓

Service

↓

MarkAttendanceWorkflow

↓

findSubmission()

↓

Status = Completed

↓

Save

↓

Response
```

Future versions may support:

- QR Attendance
- Face Recognition
- NFC
- GPS Verification

---

# 11. Export CSV

```
Teacher

↓

GET /reports/activities/:id/csv

↓

authenticate()

↓

authorize()

↓

ReportController

↓

ActivityService

↓

ExportCSVWorkflow

↓

Fetch Submissions

↓

Generate CSV

↓

Return File
```

---

# 12. Common Middleware Flow

Every request follows:

```
Request

↓

authenticate()

↓

authorize()

↓

Validator

↓

validate()

↓

Controller
```

This guarantees:

- Valid JWT
- Correct Role
- Valid Input

before business logic executes.

---

# 13. Transaction Flow

Only critical operations use transactions.

Example

Approve Submission

```
Start Transaction

↓

Update Submission

↓

Update User Academic Points

↓

Update Activity Statistics

↓

Create Notification

↓

Commit
```

If any step fails

```
Abort Transaction

↓

Rollback

↓

Database Restored
```

Advantages

- No partial updates
- Consistent data
- Atomic operations

---

# 14. Module Interaction Flow

Activities interact with multiple modules.

```
Activities

│

├── Auth

│       JWT

│

├── Users

│       Student

│

├── Organizations

│       Tenant Isolation

│

├── Notifications

│       Future

│

├── Leaderboard

│       Future

│

├── AI

│       Future Feedback

│

└── Analytics

        Future Reports
```

The Activities module never directly manages these systems.

Instead, it communicates through their public services.

---

# Flow Summary

```
Client

↓

Route

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Workflow

↓

Helper

↓

MongoDB

↓

ApiResponse
```

This architecture ensures:

✅ Thin Controllers

✅ Reusable Business Logic

✅ Scalable Workflows

✅ Clean Separation of Concerns

✅ Multi-Tenant Safety

✅ Transaction Support

✅ Consistent API Responses