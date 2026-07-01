# Activities Module - Revision Notes

> Purpose: Fast revision guide for interviews and project maintenance.

# 1. Module Summary

The Activities module manages academic and extracurricular activities
for every organization.

Core responsibilities: - Create activities - Update activities -
Publish/Close activities - Accept student submissions - Approve/Reject
submissions - Mark attendance - Export reports - Award academic points

# 2. Folder Structure

``` text
activities/
├── constants/
├── models/
├── validators/
├── helpers/
├── workflows/
├── services/
├── controllers/
├── routes/
└── index.js
```

# 3. Architecture

``` text
Client
 ↓
Routes
 ↓
Authentication
 ↓
Authorization
 ↓
Validators
 ↓
Validate Middleware
 ↓
Controllers
 ↓
Services
 ↓
Workflows
 ↓
Helpers
 ↓
Models
 ↓
MongoDB
```

# 4. Responsibilities

## Controllers

-   Receive HTTP requests
-   Call service layer
-   Return ApiResponse
-   Never contain business logic

## Services

-   Public API of Activities module
-   Delegates to workflows
-   Used by other modules

## Workflows

Each workflow represents one business use case.

Examples: - createActivity - updateActivity - publishActivity -
closeActivity - deleteActivity - submitActivity - approveSubmission -
rejectSubmission - markAttendance - exportCSV

## Helpers

Reusable database operations: - findActivity() - findSubmission() -
applySession()

## Models

-   Activity
-   ActivitySubmission

## Validators

Validate request payload before controller execution.

# 5. Request Lifecycle

``` text
Request
 ↓
Route
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
 ↓
Service
 ↓
Workflow
 ↓
Helper
 ↓
Model
 ↓
Database
 ↓
ApiResponse
```

# 6. Models Revision

## Activity

Stores: - title - description - type - config - rules - organization -
createdBy - status - statistics - timestamps

## ActivitySubmission

Stores: - activity - student - answers - attachment - status -
feedback - score - reviewedBy - reviewedAt

# 7. Middleware Revision

authenticate() - Verifies JWT - Loads req.user

authorize() - Checks roles

validate() - Returns validation errors

asyncHandler() - Removes repetitive try/catch

# 8. Authentication

JWT → Authorization Header → authenticate() → req.user

# 9. Authorization

Student - Submit activity

Teacher - Create - Update - Publish - Close - Approve - Reject -
Attendance - Export CSV

Admin - Full access

# 10. Transactions

Used for critical workflows.

Example: Approve Submission

``` text
Start Transaction
 ↓
Update Submission
 ↓
Award Academic Points
 ↓
Update Statistics
 ↓
Create Notification
 ↓
Commit
```

Failure:

``` text
Abort
 ↓
Rollback
```

Remember: - startSession() - startTransaction() - commitTransaction() -
abortTransaction() - endSession()

# 11. Why pass Session?

Reads and writes should participate in the same transaction.

Use:

-   query.session(session)
-   save({ session })

applySession() avoids duplicate code.

# 12. Error Handling

Custom Errors: - BadRequestError - UnauthorizedError - ForbiddenError -
NotFoundError - ConflictError

Global error handler returns consistent responses.

# 13. API Response

``` json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

# 14. Multi-Tenant Design

Every activity belongs to an organization.

Never trust organization id from client.

Always use:

req.user.organization

# 15. Best Practices

-   Thin controllers
-   Business logic in workflows
-   Services expose module API
-   Reuse helpers
-   Validate early
-   Use transactions for multi-document updates
-   Soft delete instead of hard delete
-   Standardize responses

# 16. Common Interview Questions

Why services? - Stable public API.

Why workflows? - Isolate business use cases and keep services clean.

Why helpers? - Avoid duplicated database logic.

Why validators? - Reject invalid input before business logic.

Why transactions? - Maintain consistency across multiple updates.

Why soft delete? - Preserve history and allow recovery.

# 17. Common Mistakes

-   Putting DB code in controllers
-   Skipping authorization
-   Trusting client organization id
-   Forgetting transactions
-   Duplicating queries
-   Mixing HTTP logic with business logic

# 18. One-Page Cheat Sheet

``` text
Models
├── Activity
└── ActivitySubmission

Controllers
├── ActivityController
├── SubmissionController
└── ReportController

Service
└── ActivityService

Workflows
├── Create
├── Update
├── Publish
├── Close
├── Delete
├── Submit
├── Approve
├── Reject
├── Attendance
└── Export CSV

Helpers
├── findActivity
├── findSubmission
└── applySession

Middleware
├── authenticate
├── authorize
├── validate
└── asyncHandler

Patterns
✔ Layered Architecture
✔ Workflow Pattern
✔ Facade Service
✔ Soft Delete
✔ Multi-Tenancy
✔ Transactions
✔ Centralized Error Handling
```

# Final Revision

Remember this sequence:

``` text
Route
→ Middleware
→ Validator
→ Controller
→ Service
→ Workflow
→ Helper
→ Model
→ MongoDB
→ ApiResponse
```

If you can explain each layer's responsibility and why it exists, you
can confidently discuss the Activities module in technical interviews.
