# Why Controllers?

Interviewer:

Why didn't you put business logic inside controllers?

Answer:

Controllers belong to the HTTP layer.

Their responsibility is only

- Receive Request
- Call Service
- Return Response

This makes them reusable, testable and easy to maintain.

# Why Services?

Interviewer:

Why create a service layer?

Answer:

Services expose the public API of the module.

Other modules never communicate directly with controllers or models.

This reduces coupling.

# Why Workflows?

Interviewer:

Why introduce workflows?

Answer:

Each workflow represents a business use case.

Examples

Create Activity

Approve Submission

Submit Assignment

As the application grows, workflows can evolve independently without making services excessively large.

# Why Helpers?

Interviewer:

Why not call Activity.findOne() everywhere?

Answer:

That duplicates code.

Instead,

findActivity()

contains

- organization validation
- soft delete check
- future transaction support

One change updates every workflow.

# Why Transactions?

Interviewer:

Why did you use Mongo Transactions?

Answer:

Approving a submission updates multiple collections.

Without transactions,

some updates may succeed while others fail.

Transactions guarantee

ALL succeed

OR

NONE succeed.

# Why Soft Delete?

Interviewer:

Why not permanently delete?

Answer:

Educational records should be recoverable.

Soft delete also supports

- Audit
- Analytics
- Restore

# Why Validators?

Interviewer:

Why validate before controller?

Answer:

Controllers should only execute business logic.

Invalid requests are rejected before reaching controllers.

# Why AsyncHandler?

Answer

Removes repetitive try/catch.

All async errors automatically reach the global error handler.

# Why ApiResponse?

Instead of

res.json()

everywhere,

we standardize

success

message

data

status

across the entire backend.

How would you scale Activities?

How would you support multiple universities?

How would you add certificates?

How would you implement AI evaluation?

Why MongoDB instead of PostgreSQL?

Why not microservices?

Why use JWT?

Why organization everywhere?

How would you cache activities?

How would you support millions of submissions?